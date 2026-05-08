from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from lib.registry import REGISTRY, UnknownMiniAppError
from lib.models import Turn
from lib.engine import Engine
from lib.llm_client import LLMClient, LLMTimeoutError, LLMRateLimitError, LLMInvalidOutputError
from lib.safety import SafetyChecker
from lib.ip_resources_loader import IPResourceLoader

router = APIRouter()


def get_engine() -> Engine:
    return Engine(LLMClient(), IPResourceLoader(), SafetyChecker())


class ResponseRequest(BaseModel):
    mini_app_id: str
    scenario: str
    user_response: str
    turns: list[Turn] = []


@router.post("/responses")
async def create_response(
    body: ResponseRequest,
    engine: Engine = Depends(get_engine),
):
    turns = body.turns[-6:]

    try:
        definition = REGISTRY.get(body.mini_app_id)
    except UnknownMiniAppError:
        raise HTTPException(status_code=404, detail={"code": "mini_app_not_found"})

    try:
        feedback = await engine.evaluate_response(
            definition=definition,
            scenario=body.scenario,
            user_response=body.user_response,
            history=turns,
        )
    except LLMTimeoutError:
        raise HTTPException(status_code=504, detail={"code": "llm_timeout"})
    except LLMRateLimitError:
        raise HTTPException(status_code=429, detail={"code": "rate_limited"})
    except LLMInvalidOutputError:
        raise HTTPException(status_code=502, detail={"code": "llm_invalid_output"})

    return feedback.model_dump()
