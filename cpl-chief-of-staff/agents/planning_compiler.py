import json
from datetime import datetime

import vertexai
from vertexai.generative_models import GenerativeModel

from config import GCP_PROJECT, GCP_REGION, NOTIFICATION_EMAIL, WELLNESS_MAX_MEETING_HOURS
from storage.firestore_client import get_open_action_items, log_agent_run
from tools.calendar_tools import calculate_daily_load, get_week_events
from tools.gdocs_tools import create_weekly_planning_doc
from tools.gmail_tools import get_unread_emails, send_notification_email


def _strip_code_fence(text: str) -> str:
    raw = text.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        if len(parts) > 1:
            raw = parts[1]
        if raw.lstrip().startswith("json"):
            raw = raw.lstrip()[4:]
    return raw.strip()


def run_planning_compiler(email_triage_result: dict | None = None) -> dict:
    """Module 2 - Weekly Planning Document."""
    print("Module 2: Weekly Planning Compiler starting...")

    print("  Fetching calendar...")
    cal_data = get_week_events(days_ahead=7, days_back=7)
    daily_load = calculate_daily_load(cal_data["upcoming"])

    print("  Fetching email...")
    recent_email = get_unread_emails(max_results=20)

    print("  Fetching Firestore action items...")
    action_items = get_open_action_items()

    flags = [
        f"{date}: {d['total_hours']}h of meetings"
        for date, d in daily_load.items()
        if d["total_hours"] > WELLNESS_MAX_MEETING_HOURS
    ]

    if len(flags) >= 3:
        wellness = "RED - multiple heavy meeting days"
    elif flags:
        wellness = "YELLOW - some days exceed threshold"
    else:
        wellness = "GREEN - load within sustainable limits"

    vertexai.init(project=GCP_PROJECT, location=GCP_REGION)
    model = GenerativeModel("gemini-2.0-flash")
    context = {
        "date": datetime.now().strftime("%A, %B %d, %Y"),
        "past_events": cal_data["past"][:20],
        "upcoming_events": cal_data["upcoming"][:20],
        "recent_emails": recent_email[:15],
        "action_items": action_items[:20],
        "wellness_flags": flags,
        "wellness_status": wellness,
        "email_triage": email_triage_result or "not available",
    }

    prompt = f"""
You are Lisa's AI Chief of Staff. Today is {context['date']} (Friday).

Produce the 6-section weekly planning document.
Tone: direct, executive-level, actionable. No filler. No markdown.

DATA: {json.dumps(context, indent=2, default=str)}

Return ONLY valid JSON - no code fences:
{{
  "week_in_review": "What happened this week. Key meetings, decisions, completions.",
  "priority_actions": "Top 3 items for next week. Format: 1. WHAT - WHY - NEXT STEP",
  "upcoming_commitments": "Next week schedule with context. Flag conflicts.",
  "delegatable_items": "What Lisa does not need to personally handle + suggested owner.",
  "open_loops": "Unresolved threads or commitments + single best next step each.",
  "wellness_notes": "Status: {wellness}. Flags: {flags if flags else ['None']}."
}}
"""

    print("  Calling Gemini 2.0 Flash...")
    response = model.generate_content(prompt)
    plan_content = json.loads(_strip_code_fence(response.text))
    print("  Planning content generated.")

    print("  Creating Google Doc...")
    doc = create_weekly_planning_doc(content=plan_content)

    if NOTIFICATION_EMAIL:
        send_notification_email(
            to=NOTIFICATION_EMAIL,
            subject=f"[Chief of Staff] Weekly Plan - {datetime.now().strftime('%B %d')}",
            body=(
                "Your weekly planning document is ready.\n\n"
                f"Open it here: {doc['doc_url']}\n\n"
                f"PRIORITY ACTIONS:\n{plan_content.get('priority_actions', 'See doc.')}\n\n"
                f"WELLNESS: {wellness}"
            ),
        )
        print(f"  Notification sent to {NOTIFICATION_EMAIL}")

    log_agent_run("weekly_planning", "complete", f"Doc: {doc['doc_url']}")

    print("\n  Module 2 complete.")
    print(f"  Doc: {doc['doc_url']}")
    print(f"  Wellness: {wellness}")
    return {"status": "complete", **doc, "wellness_status": wellness}


if __name__ == "__main__":
    result = run_planning_compiler()
    print("\n--- RESULT ---")
    print(f"Doc URL: {result['doc_url']}")
