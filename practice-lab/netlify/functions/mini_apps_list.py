import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

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

    mini_apps = [
        {
            "id": d.id,
            "name": d.name,
            "skill_one_liner": d.skill_one_liner,
            "estimated_time": d.estimated_time,
        }
        for d in REGISTRY.list()
    ]

    return {
        "statusCode": 200,
        "headers": _HEADERS,
        "body": json.dumps({"mini_apps": mini_apps}),
    }
