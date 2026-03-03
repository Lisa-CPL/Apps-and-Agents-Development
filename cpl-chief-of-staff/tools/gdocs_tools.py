from datetime import datetime

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open("token.json", "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("docs", "v1", credentials=creds)


def create_weekly_planning_doc(content: dict) -> dict:
    """Create a new Google Doc with six planning sections."""
    svc = _get_service()
    date_str = datetime.now().strftime("%B %d, %Y")
    title = f"CPL Chief of Staff - Weekly Plan - {date_str}"
    doc = svc.documents().create(body={"title": title}).execute()
    doc_id = doc["documentId"]

    requests = []
    cursor = 1

    def insert(text, bold=False, size=11, newlines=1):
        nonlocal cursor
        full = text + ("\n" * newlines)
        requests.append({"insertText": {"location": {"index": cursor}, "text": full}})
        requests.append(
            {
                "updateTextStyle": {
                    "range": {"startIndex": cursor, "endIndex": cursor + len(full)},
                    "textStyle": {
                        "bold": bold,
                        "fontSize": {"magnitude": size, "unit": "PT"},
                        "weightedFontFamily": {"fontFamily": "Arial"},
                    },
                    "fields": "bold,fontSize,weightedFontFamily",
                }
            }
        )
        cursor += len(full)

    insert(title, bold=True, size=18, newlines=2)
    insert(
        f"Generated: {datetime.now().strftime('%A, %B %d, %Y at %I:%M %p')}",
        size=10,
        newlines=2,
    )

    sections = [
        ("WEEK IN REVIEW", content.get("week_in_review", "No data.")),
        ("PRIORITY ACTIONS", content.get("priority_actions", "No priorities.")),
        ("UPCOMING COMMITMENTS", content.get("upcoming_commitments", "No upcoming events.")),
        ("DELEGATABLE ITEMS", content.get("delegatable_items", "None identified.")),
        ("OPEN LOOPS", content.get("open_loops", "No open loops.")),
        ("WELLNESS NOTES", content.get("wellness_notes", "Calendar within limits.")),
    ]

    for heading, body_text in sections:
        insert("-" * 60, size=9, newlines=1)
        insert(heading, bold=True, size=13, newlines=1)
        insert(body_text, size=11, newlines=2)

    svc.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()

    url = f"https://docs.google.com/document/d/{doc_id}/edit"
    return {"doc_id": doc_id, "doc_url": url, "title": title}
