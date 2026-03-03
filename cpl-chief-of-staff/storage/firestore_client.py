from google.cloud import firestore

from config import GCP_PROJECT

db = firestore.Client(project=GCP_PROJECT)


def get_open_action_items() -> list[dict]:
    docs = db.collection("action_items").where("status", "==", "open").stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]


def save_action_items(items: list[dict], source: str = "manual"):
    for item in items:
        db.collection("action_items").add(
            {
                "who": item.get("who", "TBD"),
                "what": item.get("what", ""),
                "by_when": item.get("by_when", "TBD"),
                "source": source,
                "status": "open",
                "created_at": firestore.SERVER_TIMESTAMP,
            }
        )


def save_pending_approval(action_type: str, agent: str, payload: dict) -> str:
    ref = db.collection("pending_approvals").add(
        {
            "action_type": action_type,
            "agent": agent,
            "payload": payload,
            "status": "pending",
            "created_at": firestore.SERVER_TIMESTAMP,
        }
    )
    return ref[1].id


def log_agent_run(trigger: str, status: str, summary: str = ""):
    db.collection("agent_runs").add(
        {
            "trigger": trigger,
            "status": status,
            "summary": summary,
            "timestamp": firestore.SERVER_TIMESTAMP,
        }
    )
