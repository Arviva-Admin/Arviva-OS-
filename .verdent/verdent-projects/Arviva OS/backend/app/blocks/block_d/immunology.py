"""
Block D — Immunological System
1. PII Scrubbing via Microsoft Presidio (local microservice)
2. Hallucination Guardrail — cosine similarity(source_embedding, output_embedding) < 0.75 → block
"""
from __future__ import annotations

import numpy as np
import structlog
import httpx
from fastapi import HTTPException

from app.core.config import settings

log = structlog.get_logger()


class PIIScrubError(Exception):
    pass


class PresidioScrubber:
    """
    Calls the local Presidio analyzer + anonymizer HTTP services.
    PRESIDIO_ANALYZER_URL / PRESIDIO_ANONYMIZER_URL are stored as full base URLs
    (e.g. http://presidio-analyzer:3001) — no scheme is prepended here.
    Fails CLOSED: raises PIIScrubError rather than leaking unredacted text.
    """

    async def scrub(self, text: str, language: str = "en") -> str:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Step 1: analyze — URL already contains scheme
                analyze_resp = await client.post(
                    f"{settings.PRESIDIO_ANALYZER_URL}/analyze",
                    json={"text": text, "language": language},
                )
                analyze_resp.raise_for_status()
                entities = analyze_resp.json()

                # Step 2: anonymize
                anon_resp = await client.post(
                    f"{settings.PRESIDIO_ANONYMIZER_URL}/anonymize",
                    json={
                        "text": text,
                        "analyzer_results": entities,
                        "anonymizers": {
                            "DEFAULT": {"type": "replace", "new_value": "<REDACTED>"}
                        },
                    },
                )
                anon_resp.raise_for_status()
                return anon_resp.json()["text"]
        except Exception as exc:
            log.error("presidio.scrub_failed", error=str(exc))
            raise HTTPException(
                status_code=503,
                detail="PII scrubbing service unavailable — request blocked to prevent data leak.",
            ) from exc


class HallucinationGuardrail:
    """
    Compares source_embedding vs agent_output_embedding.
    If cosine similarity < 0.75, block the response and raise an alert.
    """

    THRESHOLD = settings.HALLUCINATION_COSINE_THRESHOLD

    @staticmethod
    def _cosine(a: list[float], b: list[float]) -> float:
        va = np.array(a, dtype=np.float32)
        vb = np.array(b, dtype=np.float32)
        norm_a = np.linalg.norm(va)
        norm_b = np.linalg.norm(vb)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(va, vb) / (norm_a * norm_b))

    def check(
        self,
        source_embedding: list[float],
        output_embedding: list[float],
        agent_id: str = "unknown",
    ) -> tuple[bool, float]:
        """
        Returns (passed: bool, similarity: float).
        passed=False means the output is blocked and flagged.
        """
        sim = self._cosine(source_embedding, output_embedding)
        passed = sim >= self.THRESHOLD
        if not passed:
            log.warning(
                "hallucination_guardrail.blocked",
                agent_id=agent_id,
                similarity=sim,
                threshold=self.THRESHOLD,
            )
        return passed, sim


presidio_scrubber = PresidioScrubber()
hallucination_guardrail = HallucinationGuardrail()
