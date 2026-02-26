from flask import Flask, request, jsonify
from agents.orchestrator import root_agent
from google.adk.runners import Runner
import base64, json

app = Flask(__name__)
runner = Runner(agent=root_agent, app_name="chief_of_staff")

def trigger(event_name: str, context: dict = None):
    message = event_name
    if context:
        message += " " + json.dumps(context)
    result = runner.run(message=message)
    return result

@app.route("/trigger", methods=["POST"])
def handle_trigger():
    # Decode Pub/Sub message
    envelope = request.get_json()
    message  = envelope["message"]
    data     = base64.b64decode(message["data"]).decode("utf-8")
    payload  = json.loads(data)
    
    trigger_name = payload.get("trigger", "morning_brief")
    context      = payload.get("context", {})
    
    result = runner.run(message=trigger_name)
    return jsonify({"status": "ok", "trigger": trigger_name}), 200

@app.route("/health", methods=["GET"])
def health():
    return {"status": "healthy"}, 200

if __name__ == "__main__":
    import sys
    # Support triggering directly from command line for local dev
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_trigger = sys.argv[2] if len(sys.argv) > 2 else "email_check"
        print(f"Testing {test_trigger}...")
        result = trigger(test_trigger)
        print(json.dumps(result, indent=2))
    else:
        app.run(host="0.0.0.0", port=8080)
