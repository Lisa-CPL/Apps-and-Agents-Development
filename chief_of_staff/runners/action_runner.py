from storage.firestore_client import get_approved_actions, mark_action_executed
from tools.slack_tools  import post_slack_message
from tools.gmail_tools  import send_approved_draft
import logging

def execute_approved_actions():
    """Polls Firestore for approved actions and executes them."""
    approved = get_approved_actions()  # status == "approved"
    
    for action in approved:
        action_type = action["action_type"]
        payload     = action["payload"]
        action_id   = action["action_id"]
        
        try:
            if action_type == "slack_post":
                post_slack_message(
                    channel=payload["channel"],
                    message=payload["message"]
                )
            elif action_type == "gmail_send_draft":
                send_approved_draft(draft_id=payload["draft_id"])
            
            elif action_type == "calendar_block":
                # Calendar write — requires explicit user intent
                # In v1: notify Lisa to create manually
                logging.info(f"Calendar block suggested — manual creation required: {payload}")
                
            mark_action_executed(action_id)
            logging.info(f"Executed action {action_id}: {action_type}")
            
        except Exception as e:
            logging.error(f"Failed to execute {action_id}: {e}")

if __name__ == "__main__":
    execute_approved_actions()
