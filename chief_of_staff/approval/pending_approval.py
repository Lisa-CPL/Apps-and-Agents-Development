from tools.gdocs_tools import append_to_approval_doc
from tools.gmail_tools  import send_notification_email
from storage.firestore_client import log_pending_action
from config import PENDING_APPROVAL_DOC_ID, PENDING_APPROVAL_EMAIL
import json, uuid
from datetime import datetime

def submit_for_approval(action_type: str, payload: dict, agent: str) -> str:
    """
    Submits an agent action for Lisa's approval.
    Returns an action_id for tracking.
    """
    action_id = str(uuid.uuid4())[:8]
    timestamp = datetime.utcnow().isoformat()
    # Build human-readable block for the Google Doc
    doc_entry = f"""
---
ACTION ID:   {action_id}
AGENT:       {agent}
TYPE:        {action_type}
TIMESTAMP:   {timestamp}
STATUS:      [ ] APPROVE   [ ] EDIT   [ ] REJECT
DETAILS:
{json.dumps(payload, indent=2)}
---
    """.strip()
    
    # Append to Pending Approval Google Doc
    append_to_approval_doc(PENDING_APPROVAL_DOC_ID, doc_entry)
    
    # Log to Firestore
    log_pending_action({
        "action_id":   action_id,
        "action_type": action_type,
        "agent":       agent,
        "payload":     payload,
        "status":      "pending",
        "created_at":  timestamp,
    })
    
    return action_id

def notify_approval_needed(pending_count: int):
    """Sends Lisa a notification that items are awaiting approval."""
    # This send IS automated — it's a notification, not an action
    send_notification_email(
        to=PENDING_APPROVAL_EMAIL,
        subject=f"[Chief of Staff] {pending_count} item(s) awaiting your approval",
        body=f"{pending_count} items from your AI Chief of Staff require review.\n\nReview here: https://docs.google.com/document/d/{PENDING_APPROVAL_DOC_ID}"
    )
