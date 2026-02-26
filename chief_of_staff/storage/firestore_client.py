from google.cloud import firestore

db = firestore.Client()

# ─── Action Items ─────────────────────────────
def save_action_items(items: list[dict], meeting_id: str):
    for item in items:
        db.collection("action_items").add({
            "meeting_id": meeting_id,
            "who":        item.get("who"),
            "what":       item.get("what"),
            "by_when":    item.get("by_when"),
            "status":     "open",
            "created_at": firestore.SERVER_TIMESTAMP,
        })

def get_open_action_items() -> list[dict]:
    docs = db.collection("action_items").where("status", "==", "open").stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]

def close_action_item(item_id: str):
    db.collection("action_items").document(item_id).update({"status": "closed"})

# ─── Approval Queue ───────────────────────────
def log_pending_action(action: dict):
    db.collection("pending_actions").document(action["action_id"]).set(action)

def get_approved_actions() -> list[dict]:
    docs = db.collection("pending_actions").where("status", "==", "approved").stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]

def mark_action_executed(action_id: str):
    db.collection("pending_actions").document(action_id).update({
        "status":      "executed",
        "executed_at": firestore.SERVER_TIMESTAMP,
    })

# ─── Audit Log ────────────────────────────────
def log_agent_run(trigger: str, agent: str, status: str, duration_ms: int):
    db.collection("agent_runs").add({
        "trigger":     trigger,
        "agent":       agent,
        "status":      status,
        "duration_ms": duration_ms,
        "timestamp":   firestore.SERVER_TIMESTAMP,
    })

# ─── Feedback ─────────────────────────────────
def save_feedback(agent: str, item_id: str, correction_type: str, notes: str):
    db.collection("feedback").add({
        "agent":           agent,
        "item_id":         item_id,
        "correction_type": correction_type,  # "reclassify|reroute|format|other"
        "notes":           notes,
        "created_at":      firestore.SERVER_TIMESTAMP,
    })
