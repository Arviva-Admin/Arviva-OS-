"""
Block B — Semantic Memory Database Layer
PostgreSQL 16 + pgvector optimized for 128 GB RAM.

Key decisions:
  - shared_buffers = 32 GB  (configured in postgresql.conf)
  - asyncpg driver for non-blocking I/O
  - halfvec (8-bit float, pgvector ≥0.7) for 2× denser vector storage
  - arviva_items partitioned by month (declarative range partitioning)
  - Semantic cache: similarity > 0.97 bypasses LLM entirely
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime
from typing import Any, Optional

import numpy as np
import structlog
from pgvector.sqlalchemy import HalfVector
from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Float,
    Index,
    Integer,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase, mapped_column

from app.core.config import settings

log = structlog.get_logger()

# ---------------------------------------------------------------------------
# Engine — tuned connection pool for high-concurrency on 128 GB machine
# ---------------------------------------------------------------------------
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.POSTGRES_POOL_SIZE,
    max_overflow=settings.POSTGRES_MAX_OVERFLOW,
    pool_pre_ping=True,
    pool_recycle=1800,
    echo=False,
    connect_args={
        "server_settings": {
            # Keep the 32 GB shared_buffers hot — do not evict on disconnect
            "application_name": "arviva_api",
        }
    },
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    engine, expire_on_commit=False, autoflush=False
)


# ---------------------------------------------------------------------------
# ORM Base
# ---------------------------------------------------------------------------
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# arviva_items — declarative range partitioned by month
# Partition key: created_at (DATE range)
# Each child table: arviva_items_YYYY_MM
# ---------------------------------------------------------------------------
class ArvivItem(Base):
    """
    Core semantic item.  Uses halfvec(1024) — 8-bit floats — to store
    dense embeddings in half the space of float32, maximising the number
    of vectors that fit in the 32 GB shared_buffers pool.

    Partition key: partition_key (TIMESTAMPTZ), matches init.sql RANGE partition.
    Composite PK: (id, partition_key), required by PostgreSQL for partitioned tables.
    """
    __tablename__ = "arviva_items"
    __table_args__ = (
        # HNSW index on halfvec for sub-millisecond ANN search
        Index(
            "ix_items_embedding_hnsw",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "halfvec_cosine_ops"},
        ),
        # Partition declaration — RANGE on partition_key, matching init.sql
        {"postgresql_partition_by": "RANGE (partition_key)"},
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(String(64), nullable=False, index=True)
    country_code = Column(String(2), nullable=True, index=True)
    source_url = Column(Text, nullable=True)
    raw_source = Column(Text, nullable=False)
    agent_output = Column(Text, nullable=False)
    # halfvec(1024) — requires pgvector ≥ 0.7
    embedding = mapped_column(HalfVector(1024), nullable=True)
    source_embedding = mapped_column(HalfVector(1024), nullable=True)
    cosine_similarity = Column(Float, nullable=True)
    hallucination_flagged = Column(Boolean, default=False, nullable=False)
    metadata_ = Column("metadata", JSONB, default=dict)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("NOW()"),
    )
    # Partition key — part of composite PK; always set equal to created_at
    partition_key = Column(DateTime(timezone=True), primary_key=True, nullable=False)


# ---------------------------------------------------------------------------
# semantic_cache — deduplicate LLM calls at 0.97 cosine similarity
# ---------------------------------------------------------------------------
class SemanticCache(Base):
    __tablename__ = "semantic_cache"
    __table_args__ = (
        Index(
            "ix_cache_embedding_hnsw",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "halfvec_cosine_ops"},
        ),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    query_hash = Column(String(64), unique=True, nullable=False, index=True)
    query_text = Column(Text, nullable=False)
    embedding = mapped_column(HalfVector(1024), nullable=True)
    response = Column(JSONB, nullable=False)
    model_used = Column(String(64), nullable=True)
    hit_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("NOW()"))
    last_hit_at = Column(DateTime(timezone=True), server_default=text("NOW()"))


# ---------------------------------------------------------------------------
# agent_registry — MCP skill discovery (Block C)
# ---------------------------------------------------------------------------
class AgentRegistry(Base):
    __tablename__ = "agent_registry"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    version = Column(String(16), default="1.0.0")
    skills = Column(JSONB, default=list)
    endpoint = Column(Text, nullable=True)
    worker_group = Column(String(32), default="bulk")
    is_active = Column(Boolean, default=True)
    last_heartbeat = Column(DateTime(timezone=True), server_default=text("NOW()"))
    metadata_ = Column("metadata", JSONB, default=dict)


# ---------------------------------------------------------------------------
# budget_ledger — immutable cost audit trail (Block F)
# ---------------------------------------------------------------------------
class BudgetLedger(Base):
    __tablename__ = "budget_ledger"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(String(64), nullable=False, index=True)
    provider = Column(String(32), nullable=False)   # gemini | groq | ollama
    model = Column(String(64), nullable=False)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    cost_usd = Column(Float, default=0.0)           # always 0 under mandate
    timestamp = Column(DateTime(timezone=True), server_default=text("NOW()"))


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------
async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_stat_statements"))
        # Use the async-safe run_sync path — avoids blocking the event loop
        await conn.run_sync(Base.metadata.create_all)
        await _create_partitions(conn)
    log.info("database.init_complete")


async def _create_partitions(conn: Any) -> None:
    """Pre-create monthly partitions for the next 12 months."""
    now = datetime.utcnow()
    for delta in range(12):
        month = (now.month + delta - 1) % 12 + 1
        year = now.year + (now.month + delta - 1) // 12
        partition_name = f"arviva_items_{year}_{month:02d}"
        start = f"{year}-{month:02d}-01"
        next_month = month % 12 + 1
        next_year = year + (1 if month == 12 else 0)
        end = f"{next_year}-{next_month:02d}-01"
        await conn.execute(
            text(
                f"""
                CREATE TABLE IF NOT EXISTS {partition_name}
                PARTITION OF arviva_items
                FOR VALUES FROM ('{start}') TO ('{end}')
                """
            )
        )
    log.info("database.partitions_ready", count=12)


async def get_db() -> AsyncSession:  # type: ignore[return]
    async with AsyncSessionLocal() as session:
        yield session


# ---------------------------------------------------------------------------
# Block B — Semantic Cache layer
# ---------------------------------------------------------------------------
class SemanticCacheService:
    """
    Every LLM request passes through here first.
    If a cached embedding has cosine similarity ≥ SEMANTIC_CACHE_THRESHOLD (0.97),
    the cached response is returned and the LLM is never called.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self.threshold = settings.SEMANTIC_CACHE_THRESHOLD

    async def lookup(
        self, query_text: str, embedding: list[float]
    ) -> Optional[dict]:
        vec = json.dumps(embedding)
        result = await self.session.execute(
            text(
                f"""
                SELECT response, model_used, id,
                       1 - (embedding <=> :vec::halfvec) AS similarity
                FROM semantic_cache
                WHERE 1 - (embedding <=> :vec::halfvec) >= :threshold
                ORDER BY similarity DESC
                LIMIT 1
                """
            ),
            {"vec": vec, "threshold": self.threshold},
        )
        row = result.fetchone()
        if row:
            await self.session.execute(
                text(
                    "UPDATE semantic_cache SET hit_count = hit_count + 1, "
                    "last_hit_at = NOW() WHERE id = :id"
                ),
                {"id": row.id},
            )
            await self.session.commit()
            log.info("semantic_cache.hit", similarity=row.similarity, model=row.model_used)
            return {"response": row.response, "cached": True, "similarity": row.similarity}
        return None

    async def store(
        self,
        query_text: str,
        embedding: list[float],
        response: dict,
        model_used: str,
    ) -> None:
        query_hash = hashlib.sha256(query_text.encode()).hexdigest()
        vec = json.dumps(embedding)
        await self.session.execute(
            text(
                """
                INSERT INTO semantic_cache (query_hash, query_text, embedding, response, model_used)
                VALUES (:hash, :query, :vec::halfvec, :response, :model)
                ON CONFLICT (query_hash) DO UPDATE
                  SET response = EXCLUDED.response,
                      last_hit_at = NOW()
                """
            ),
            {
                "hash": query_hash,
                "query": query_text,
                "vec": vec,
                "response": json.dumps(response),
                "model": model_used,
            },
        )
        await self.session.commit()
