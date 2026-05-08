from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel


class CriterionSpec(BaseModel):
    name: str
    label: str
    description: str
    rubric: str


class CriterionAssessment(BaseModel):
    name: str
    verdict: str  # "strong" | "partial" | "needs work"
    what_worked: Optional[str] = None
    what_to_improve: Optional[str] = None


class FeedbackPayload(BaseModel):
    user_response: str
    criteria: list[CriterionAssessment]
    suggestion: str
    extras: dict[str, Any] = {}


class Turn(BaseModel):
    user: str
    feedback: FeedbackPayload


class MiniAppDefinition(BaseModel):
    id: str
    name: str
    skill_one_liner: str
    estimated_time: str
    orientation_copy: str

    scenario_system_prompt: str
    evaluation_system_prompt: str
    criteria: list[CriterionSpec]
    ip_resources: list[str] = []

    extras_schema: Optional[dict] = None
    response_validator: Optional[Any] = None

    model_config = {"arbitrary_types_allowed": True}
