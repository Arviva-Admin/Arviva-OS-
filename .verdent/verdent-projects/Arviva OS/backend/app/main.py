"""
Arviva OS 2026 — FastAPI Application Entry Point
All Blocks (A–F) wired through modular routers.
"""
from contextlib import asynccontextmanager
import secrets

import structlog
import uvicorn
from fastapi import FastAPI, Request, Security, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security.api_key import APIKeyHeader
from prometheus_client import make_asgi_app

from app.core.config import settings
from app.core.database import engine, init_db
from app.core.redis_client import redis_client
from app.routers import (
    agents,
    arbitrage,
    health,
    memory,
    orchestration,
    vitals,
)

log = structlog.get_logger()

# ---------------------------------------------------------------------------
# API Key auth — applied to all state-changing routes
# ---------------------------------------------------------------------------
_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def require_api_key(api_key: str | None = Security(_api_key_header)) -> None:
    if not api_key or not secrets.compare_digest(api_key, settings.SECRET_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("arviva_os.startup", version="2026", environment=settings.ENVIRONMENT)
    await init_db()
    await redis_client.connect()
    # Pre-warm Ollama model slot
    from app.blocks.block_a.ollama_client import OllamaClient
    await OllamaClient().warmup()
    yield
    await redis_client.disconnect()
    await engine.dispose()
    log.info("arviva_os.shutdown")


app = FastAPI(
    title="Arviva OS 2026",
    version="2026.1.0",
    description="Living Organism Architecture — ~200 Autonomous Agents",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"https://{settings.DOMAIN}"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Routers — one per Block
# health is public (used by Caddy health_uri); all others require an API key
app.include_router(health.router, tags=["System"])
app.include_router(
    vitals.router, prefix="/api/vitals",
    tags=["Block A — Vitals"],
    dependencies=[Security(require_api_key)],
)
app.include_router(
    memory.router, prefix="/api/memory",
    tags=["Block B — Semantic Memory"],
    dependencies=[Security(require_api_key)],
)
app.include_router(
    orchestration.router, prefix="/api/orchestration",
    tags=["Block C — Orchestration"],
    dependencies=[Security(require_api_key)],
)
app.include_router(
    agents.router, prefix="/api/agents",
    tags=["Block C/E — Agents"],
    dependencies=[Security(require_api_key)],
)
app.include_router(
    arbitrage.router, prefix="/api/arbitrage",
    tags=["Block C — Arbitrage Feed"],
    dependencies=[Security(require_api_key)],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.error("unhandled_exception", path=request.url.path, error=str(exc))
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
