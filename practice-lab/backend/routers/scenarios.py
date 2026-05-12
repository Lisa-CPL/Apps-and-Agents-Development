from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from lib.registry import REGISTRY, UnknownMiniAppError
from lib.models import Turn
from lib.engine import Engine, SafetyCheckError
from lib.llm_client import LLMClient, LLMTimeoutError, LLMRateLimitError, LLMInvalidOutputError
from lib.safety import SafetyChecker
from lib.ip_resources_loader import IPResourceLoader

router = APIRouter()


def get_engine() -> Engine:
    return Engine(LLMClient(), IPResourceLoader(), SafetyChecker())


class ScenarioRequest(BaseModel):
    mini_app_id: str
    turns: list[Turn] = []


@router.post("/scenarios")
async def create_scenario(
    body: ScenarioRequest,
    engine: Engine = Depends(get_engine),
):
    turns = body.turns[-6:]

    try:
        definition = REGISTRY.get(body.mini_app_id)
    except UnknownMiniAppError:
        raise HTTPException(status_code=404, detail={"code": "mini_app_not_found"})

    try:
        scenario = await engine.generate_scenario(definition, turns)
    except LLMTimeoutError:
        raise HTTPException(status_code=504, detail={"code": "llm_timeout"})
    except LLMRateLimitError:
        raise HTTPException(status_code=429, detail={"code": "rate_limited"})
    except LLMInvalidOutputError:
        raise HTTPException(status_code=502, detail={"code": "llm_invalid_output"})
    except SafetyCheckError:
        raise HTTPException(status_code=502, detail={"code": "llm_invalid_output"})

    return {"scenario": scenario}
