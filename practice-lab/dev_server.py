"""
Local development server for Practice Lab backend functions.
Simulates Netlify Functions routing so you can test with Postman
without needing the Netlify CLI.

Usage:
    python dev_server.py          # runs on port 9000
    PORT=8000 python dev_server.py  # custom port

NOTE: Do NOT run this alongside `netlify dev` on the same port.
`netlify dev` occupies 0.0.0.0:8888 and intercepts all traffic there.
Use a different port (this server defaults to 9000) or stop netlify dev first.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

# Add functions directory to path so _lib imports work
FUNCTIONS_DIR = os.path.join(os.path.dirname(__file__), "netlify", "functions")
sys.path.insert(0, FUNCTIONS_DIR)

# Load .env file if present
_env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(_env_path):
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

print(f"--- 启动前检查 ---")
print(f"GEMINI_API_KEY 是否加载: {os.environ.get('GEMINI_API_KEY') is not None}")
print(f"Key 开头字符: {os.environ.get('GEMINI_API_KEY')[:5] if os.environ.get('GEMINI_API_KEY') else 'None'}")

import health
import mini_apps_get
import mini_apps_list
import responses_create
import scenarios_create

PORT = int(os.environ.get("PORT", 9000))


def _build_event(method: str, path: str, body: bytes, headers: dict) -> dict:
    parsed = urlparse(path)
    return {
        "httpMethod": method,
        "path": parsed.path,
        "headers": dict(headers),
        "queryStringParameters": {},
        "body": body.decode("utf-8") if body else None,
        "isBase64Encoded": False,
    }


def _route(path: str, method: str) -> object:
    if path == "/api/health":
        return health
    if path == "/api/mini-apps" and method == "GET":
        return mini_apps_list
    if path.startswith("/api/mini-apps/"):
        return mini_apps_get
    if path == "/api/scenarios":
        return scenarios_create
    if path == "/api/responses":
        return responses_create
    return None


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} {fmt % args}")

    def _handle(self, method: str):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""

        module = _route(self.path.split("?")[0], method)
        if module is None:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'{"error":{"code":"not_found","message":"Route not found."}}')
            return

        event = _build_event(method, self.path, body, self.headers)
        try:
            result = module.handler(event, {})
        except Exception as e:
            result = {
                "statusCode": 500,
                "body": json.dumps({"error": {"code": "internal_error", "message": str(e)}}),
                "headers": {"Content-Type": "application/json"},
            }

        status = result.get("statusCode", 200)
        resp_headers = result.get("headers", {})
        resp_body = result.get("body", "")

        self.send_response(status)
        for k, v in resp_headers.items():
            self.send_header(k, v)
        resp_bytes = resp_body.encode("utf-8") if isinstance(resp_body, str) else resp_body
        self.send_header("Content-Length", str(len(resp_bytes)))
        self.end_headers()
        self.wfile.write(resp_bytes)

    def do_GET(self):
        self._handle("GET")

    def do_POST(self):
        self._handle("POST")

    def do_OPTIONS(self):
        self._handle("OPTIONS")


if __name__ == "__main__":
    print(f"Practice Lab backend running at http://localhost:{PORT}")
    print(f"Functions directory: {FUNCTIONS_DIR}")
    if not os.environ.get("GEMINI_API_KEY"):
        print("WARNING: GEMINI_API_KEY not set — LLM calls will fail")
    print()
    print("Available routes:")
    print("  GET  /api/health")
    print("  GET  /api/mini-apps")
    print("  GET  /api/mini-apps/:id")
    print("  POST /api/scenarios")
    print("  POST /api/responses")
    print()
    HTTPServer(("localhost", PORT), Handler).serve_forever()
