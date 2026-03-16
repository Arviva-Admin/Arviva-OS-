"""
Block E — Meta-Agent Self-Healing
The Architect: monitors builds, pipes stderr back to local LLM for auto-fix.
The Chef: shadow-mode A/B testing — promotes strategies with higher scores.
"""
from __future__ import annotations

import asyncio
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import git
import structlog

from app.blocks.block_f.cascade_router import cascade_router
from app.core.config import settings

log = structlog.get_logger()


# ---------------------------------------------------------------------------
# The Architect — Self-Healing Loop
# ---------------------------------------------------------------------------
class ArchitectAgent:
    """
    Watches a git repo. On build failure, sends stderr to the LLM
    and applies the suggested fix as a new commit.
    """

    SYSTEM_PROMPT = (
        "You are The Architect, a senior software engineer. "
        "A build has failed. Analyse the stderr below and return ONLY the corrected "
        "file content in the format:\n"
        "FILE: <path>\n```\n<corrected content>\n```\n"
        "Do not add explanations outside of code blocks."
    )

    def __init__(self):
        self.repo_path = Path(settings.GIT_REPO_PATH)

    async def run_build(self, command: list[str]) -> tuple[bool, str]:
        proc = await asyncio.create_subprocess_exec(
            *command,
            cwd=str(self.repo_path),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()
        success = proc.returncode == 0
        return success, stderr.decode()

    async def heal(self, stderr: str, max_retries: int = 3) -> bool:
        for attempt in range(1, max_retries + 1):
            log.info("architect.heal_attempt", attempt=attempt)
            response = await cascade_router.complete(
                prompt=f"Build stderr:\n\n{stderr}",
                system=self.SYSTEM_PROMPT,
            )
            applied = await self._apply_patch(response.text)
            if applied:
                repo = git.Repo(str(self.repo_path))
                repo.git.add(A=True)
                repo.index.commit(f"[Architect] auto-fix attempt {attempt}")
                log.info("architect.patch_committed", attempt=attempt)
                return True
        return False

    async def _apply_patch(self, llm_output: str) -> bool:
        import re
        pattern = r"FILE:\s*(.+?)\n```(?:\w+)?\n([\s\S]+?)\n```"
        matches = re.findall(pattern, llm_output)
        if not matches:
            log.warning("architect.no_patch_found")
            return False
        repo_root = self.repo_path.resolve()
        for file_path, content in matches:
            raw = file_path.strip()
            # Reject absolute paths and any traversal components before joining
            if raw.startswith("/") or raw.startswith("\\") or ".." in raw.split("/") or ".." in raw.split("\\"):
                log.error("architect.path_traversal_rejected", path=raw)
                return False
            target = (self.repo_path / raw).resolve()
            # Confirm the resolved path is strictly inside the repo root
            if not target.is_relative_to(repo_root):
                log.error("architect.path_escape_rejected", path=str(target), root=str(repo_root))
                return False
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)
            log.info("architect.file_patched", file=str(target))
        return True


# ---------------------------------------------------------------------------
# The Chef — Shadow Mode A/B Promoter
# ---------------------------------------------------------------------------
@dataclass
class Strategy:
    strategy_id: str
    prompt_template: str
    score: float = 0.0
    runs: int = 0
    is_production: bool = False
    metadata: dict = field(default_factory=dict)


class ChefAgent:
    """
    Runs new prompts/strategies in shadow mode alongside production.
    If shadow score exceeds production score, it is autonomously promoted.
    """

    def __init__(self):
        self._strategies: dict[str, Strategy] = {}
        self._production_id: str | None = None

    def register_strategy(self, strategy: Strategy) -> None:
        self._strategies[strategy.strategy_id] = strategy
        if strategy.is_production:
            self._production_id = strategy.strategy_id
        log.info("chef.strategy_registered", id=strategy.strategy_id, production=strategy.is_production)

    async def shadow_run(
        self,
        shadow_id: str,
        prompt: str,
        score_fn: Any,  # callable(response: str) -> float
    ) -> float:
        if shadow_id not in self._strategies:
            raise KeyError(f"Strategy {shadow_id!r} not registered")
        strategy = self._strategies[shadow_id]
        full_prompt = strategy.prompt_template.format(input=prompt)
        response = await cascade_router.complete(full_prompt)
        score = await score_fn(response.text)
        strategy.score = (strategy.score * strategy.runs + score) / (strategy.runs + 1)
        strategy.runs += 1
        log.info("chef.shadow_scored", id=shadow_id, score=score, avg=strategy.score)
        await self._maybe_promote(shadow_id)
        return score

    async def _maybe_promote(self, candidate_id: str) -> None:
        if not self._production_id or candidate_id == self._production_id:
            return
        prod = self._strategies[self._production_id]
        candidate = self._strategies[candidate_id]
        if candidate.runs >= 10 and candidate.score > prod.score:
            prod.is_production = False
            candidate.is_production = True
            self._production_id = candidate_id
            log.info(
                "chef.strategy_promoted",
                new_production=candidate_id,
                score=candidate.score,
                displaced=prod.strategy_id,
            )


architect = ArchitectAgent()
chef = ChefAgent()
