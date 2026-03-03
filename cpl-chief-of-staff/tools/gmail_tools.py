import base64

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


def _get_service():
    """Load credentials from token.json and refresh if expired."""
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open("token.json", "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)


def get_unread_emails(max_results: int = 30) -> list[dict]:
    """Fetch unread inbox emails with subject, sender, date, and snippet."""
    svc = _get_service()
    result = svc.users().messages().list(
        userId="me",
        labelIds=["INBOX", "UNREAD"],
        maxResults=max_results,
    ).execute()

    messages = []
    for msg in result.get("messages", []):
        detail = svc.users().messages().get(
            userId="me",
            id=msg["id"],
            format="metadata",
            metadataHeaders=["Subject", "From", "To", "Date"],
        ).execute()
        headers = {h["name"]: h["value"] for h in detail["payload"]["headers"]}
        messages.append(
            {
                "id": msg["id"],
                "thread_id": detail["threadId"],
                "subject": headers.get("Subject", "(no subject)"),
                "sender": headers.get("From", ""),
                "to": headers.get("To", ""),
                "date": headers.get("Date", ""),
                "snippet": detail.get("snippet", ""),
            }
        )
    return messages


def get_unreplied_threads(hours_back: int = 48) -> list[dict]:
    """Find threads Lisa opened but has not replied to."""
    svc = _get_service()
    days = max(1, hours_back // 24)
    query = f"in:inbox is:read -from:me newer_than:{days}d"
    result = svc.users().messages().list(userId="me", q=query, maxResults=50).execute()

    threads, seen = [], set()
    for msg in result.get("messages", []):
        detail = svc.users().messages().get(
            userId="me",
            id=msg["id"],
            format="metadata",
            metadataHeaders=["Subject", "From", "Date"],
        ).execute()
        tid = detail["threadId"]
        if tid in seen:
            continue
        seen.add(tid)

        thread = svc.users().threads().get(userId="me", id=tid).execute()
        lisa_replied = any(
            any(
                h["name"] == "From" and "me" in h["value"].lower()
                for h in m["payload"]["headers"]
            )
            for m in thread.get("messages", [])
        )
        if not lisa_replied:
            headers = {h["name"]: h["value"] for h in detail["payload"]["headers"]}
            threads.append(
                {
                    "thread_id": tid,
                    "subject": headers.get("Subject", "(no subject)"),
                    "sender": headers.get("From", ""),
                    "date": headers.get("Date", ""),
                    "snippet": detail.get("snippet", ""),
                }
            )
    return threads


def create_draft_reply(thread_id: str, to: str, subject: str, body: str) -> dict:
    """Create a Gmail draft reply. Does not send."""
    svc = _get_service()
    raw = f"To: {to}\r\nSubject: Re: {subject}\r\n\r\n{body}"
    enc = base64.urlsafe_b64encode(raw.encode()).decode()
    draft = svc.users().drafts().create(
        userId="me",
        body={"message": {"threadId": thread_id, "raw": enc}},
    ).execute()
    return {
        "draft_id": draft["id"],
        "thread_id": thread_id,
        "subject": subject,
        "status": "draft_created",
    }


def send_notification_email(to: str, subject: str, body: str) -> dict:
    """Send a plain system notification email."""
    svc = _get_service()
    raw = f"To: {to}\r\nSubject: {subject}\r\n\r\n{body}"
    enc = base64.urlsafe_b64encode(raw.encode()).decode()
    sent = svc.users().messages().send(userId="me", body={"raw": enc}).execute()
    return {"message_id": sent["id"], "status": "sent"}
