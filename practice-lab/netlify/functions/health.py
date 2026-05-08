import json

_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
}


def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": _HEADERS, "body": ""}

    return {
        "statusCode": 200,
        "headers": _HEADERS,
        "body": json.dumps({"status": "ok"}),
    }
