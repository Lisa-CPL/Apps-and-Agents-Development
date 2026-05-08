import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from _lib.exceptions import PracticeLabError  # noqa: E402
from _lib.registry import REGISTRY  # noqa: E402

_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
}


def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": _HEADERS, "body": ""}

    try:
        # Extract mini_app_id from path: /api/mini-apps/{id}
        path = event.get("path", "")
        segments = [s for s in path.split("/") if s]
        mini_app_id = segments[-1] if segments else None

        if not mini_app_id or mini_app_id == "mini-apps":
            return _error(400, "bad_request", "Missing mini-app id in path.")

        d = REGISTRY.get(mini_app_id)

        return {
            "statusCode": 200,
            "headers": _HEADERS,
            "body": json.dumps({
                "id": d.id,
                "name": d.name,
                "skill_one_liner": d.skill_one_liner,
                "estimated_time": d.estimated_time,
                "orientation_copy": d.orientation_copy,
                "criteria": [{"name": c.name, "label": c.label} for c in d.criteria],
            }),
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
