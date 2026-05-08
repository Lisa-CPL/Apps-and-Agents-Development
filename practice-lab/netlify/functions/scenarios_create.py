import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from _lib.engine import Engine  # noqa: E402
from _lib.exceptions import BadRequestError, PracticeLabError  # noqa: E402
from _lib.ip_resources_loader import IPResourceLoader  # noqa: E402
from _lib.llm_client import LLMClient  # noqa: E402
from _lib.models import Turn  # noqa: E402
from _lib.registry import REGISTRY  # noqa: E402
from _lib.safety import SafetyChecker  # noqa: E402

_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}


def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": _HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _error(400, "bad_request", "Request body is not valid JSON.")

    try:
        mini_app_id = body.get("mini_app_id")
        if not mini_app_id:
            raise BadRequestError("mini_app_id is required.")

        raw_turns = body.get("turns", [])
        if not isinstance(raw_turns, list):
            raise BadRequestError("turns must be an array.")
        if len(raw_turns) > 100:
            return _error(400, "turns_too_long", "turns array exceeds maximum length.")

        turns = [Turn(**t) for t in raw_turns[-6:]]
        definition = REGISTRY.get(mini_app_id)
        engine = Engine(LLMClient(), IPResourceLoader(), SafetyChecker())
        scenario = engine.generate_scenario(definition, turns)

        return {
            "statusCode": 200,
            "headers": _HEADERS,
            "body": json.dumps({"scenario": scenario}),
        }

    except PracticeLabError as e:
        return _error(e.status, e.code, e.message)
    except Exception as e:
        return _error(500, "internal_error", str(e))


def _error(status: int, code: str, message: str) -> dict:
    return {
        "statusCode": status,
        "headers": _HEADERS,
        "body": json.dumps({"error": {"code": code, "message": message}}),
    }
