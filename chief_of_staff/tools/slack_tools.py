import requests
from config import SLACK_BOT_TOKEN, SLACK_CHANNELS

def draft_slack_message(channel_key: str, message: str) -> dict:
    """Drafts a Slack message. Returns the draft payload without sending."""
    channel_id = SLACK_CHANNELS.get(channel_key)
    if not channel_id:
        return {"error": f"Channel key '{channel_key}' not found in config."}
    
    return {
        "action_type": "slack_post",
        "payload": {
            "channel": channel_id,
            "message": message
        },
        "status": "draft_created"
    }

def post_slack_message(channel: str, message: str) -> dict:
    """Posts a message to Slack (requires approval first)."""
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "channel": channel,
        "text": message
    }
    
    res = requests.post("https://slack.com/api/chat.postMessage", json=payload, headers=headers)
    res.raise_for_status()
    
    data = res.json()
    if not data.get("ok"):
        raise Exception(f"Slack API error: {data.get('error')}")
        
    return {"status": "sent", "ts": data.get("ts")}
