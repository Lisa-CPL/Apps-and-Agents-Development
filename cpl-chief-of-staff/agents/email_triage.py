import json
from datetime import datetime

import vertexai
from vertexai.generative_models import GenerativeModel

from config import (
    BOOK_KEYWORDS,
    CPL_TEAM_KEYWORDS,
    GCP_PROJECT,
    GCP_REGION,
)
from storage.firestore_client import log_agent_run, save_pending_approval
from tools.gmail_tools import create_draft_reply, get_unread_emails, get_unreplied_threads


def _strip_code_fence(text: str) -> str:
    raw = text.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        if len(parts) > 1:
            raw = parts[1]
        if raw.lstrip().startswith("json"):
            raw = raw.lstrip()[4:]
    return raw.strip()


def run_email_triage() -> dict:
    """Module 1 - Daily Email Triage."""
    print("Module 1: Email Triage starting...")

    unread = get_unread_emails(max_results=40)
    unreplied = get_unreplied_threads(hours_back=48)
    print(f"  {len(unread)} unread  |  {len(unreplied)} unreplied")

    vertexai.init(project=GCP_PROJECT, location=GCP_REGION)
    model = GenerativeModel("gemini-2.0-flash")

    prompt = f"""
You are an executive assistant for Lisa, ED of Crossing Party Lines (CPL).
Date: {datetime.now().strftime("%A, %B %d, %Y")}

CPL team keywords: {json.dumps(CPL_TEAM_KEYWORDS)}
Book keywords: {json.dumps(BOOK_KEYWORDS)}

TASK: Classify every email. Return ONLY valid JSON - no markdown, no explanation.

CATEGORIES:
  CPL_TEAM        - any CPL internal or organizational work
  BOOK            - book, media, speaking, publisher contacts
  PERSONAL        - non-organizational personal messages
  AWAITING_RESPONSE - read by Lisa but no reply in 48+ hours (from unreplied list)
  SPAM_ARCHIVE    - low-value, promotional, or junk

RULES:
- Every email in unread_emails must be classified.
- All in unreplied_threads are AWAITING_RESPONSE.
- Flag board members, funders, event partners, media as high priority.
- Write a suggested_reply (2-4 sentences) for top 3 most urgent.

EMAIL DATA:
{json.dumps({"unread_emails": unread[:25], "unreplied_threads": unreplied[:15]}, indent=2)}

Return JSON:
{{
  "triage_date": "YYYY-MM-DD",
  "total_unread": N,
  "total_unreplied": N,
  "summary": "one-line overview",
  "categories": {{
    "CPL_TEAM":          [{{id, thread_id, subject, sender, snippet, priority}}],
    "BOOK":              [{{id, thread_id, subject, sender, snippet, priority}}],
    "PERSONAL":          [{{id, thread_id, subject, sender, snippet}}],
    "AWAITING_RESPONSE": [{{thread_id, subject, sender, date}}],
    "SPAM_ARCHIVE":      [{{id, subject, sender}}]
  }},
  "reply_drafts_needed": [{{thread_id, to, subject, suggested_reply}}],
  "delete_recommendations": ["id1", "id2"],
  "critical_flags": ["description of any board/funder/media emails"]
}}
"""

    print("  Calling Gemini 2.0 Flash...")
    response = model.generate_content(prompt)
    triage = json.loads(_strip_code_fence(response.text))
    print(f"  Classification done. Categories: {list(triage.get('categories', {}).keys())}")

    created_drafts = []
    for item in triage.get("reply_drafts_needed", [])[:5]:
        try:
            draft = create_draft_reply(
                thread_id=item["thread_id"],
                to=item["to"],
                subject=item["subject"],
                body=item["suggested_reply"],
            )
            created_drafts.append({**item, "draft_id": draft["draft_id"]})
            print(f"  Draft created: {item.get('subject', '')[:50]}")
        except Exception as e:
            print(f"  Draft failed for {item.get('subject', '')}: {e}")

    triage["created_drafts"] = created_drafts

    approval_id = save_pending_approval(
        action_type="email_triage_review",
        agent="email_triage_agent",
        payload={"triage_summary": triage, "drafts_pending": created_drafts},
    )

    log_agent_run(
        "email_check",
        "complete",
        f"Triaged {len(unread)} unread, {len(unreplied)} unreplied, {len(created_drafts)} drafts.",
    )

    print(f"  Module 1 complete. Firestore approval ID: {approval_id}")
    return triage


if __name__ == "__main__":
    result = run_email_triage()
    print("\n--- TRIAGE SUMMARY ---")
    print(f"Date: {result.get('triage_date')}")
    print(f"Summary: {result.get('summary')}")
    for cat, items in result.get("categories", {}).items():
        print(f"  {cat}: {len(items)} emails")
    print(f"Drafts created: {len(result.get('created_drafts', []))}")
    print(f"Critical flags: {result.get('critical_flags', [])}")
