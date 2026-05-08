from __future__ import annotations
from typing import Any, Callable
from pydantic import BaseModel


class CriterionSpec(BaseModel):
    name: str
    label: str
    description: str
    rubric: str


class CriterionAssessment(BaseModel):
    name: str
    verdict: str  # "strong" | "partial" | "needs work"
    what_worked: str | None = None
    what_to_improve: str | None = None


class FeedbackPayload(BaseModel):
    user_response: str
    criteria: list[CriterionAssessment]
    suggestion: str
    extras: dict[str, Any] = {}


class Turn(BaseModel):
    user: str
    feedback: FeedbackPayload


class MiniAppDefinition(BaseModel):
    model_config = {"arbitrary_types_allowed": True}

    id: str
    name: str
    skill_one_liner: str
    estimated_time: str
    orientation_copy: str

    scenario_system_prompt: str
    evaluation_system_prompt: str
    criteria: list[CriterionSpec]
    ip_resources: list[str] = []

    extras_schema: dict | None = None
    response_validator: Callable[[str], None] | None = None
