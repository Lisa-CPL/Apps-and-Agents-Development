import base64
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import json, os

def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return build("gmail", "v1", credentials=creds)

def get_unread_emails(max_results: int = 30) -> list[dict]:
    """Fetches unread emails. Returns list of {id, subject, sender, snippet, date, thread_id}."""
    svc = _get_service()
    res = svc.users().messages().list(
        userId="me", labelIds=["UNREAD"], maxResults=max_results
    ).execute()
    messages = []
    for msg in res.get("messages", []):
        detail = svc.users().messages().get(userId="me", id=msg["id"], format="metadata").execute()
        headers = {h["name"]: h["value"] for h in detail["payload"]["headers"]}
        messages.append({
            "id":        msg["id"],
            "thread_id": detail["threadId"],
            "subject":   headers.get("Subject", "(no subject)"),
            "sender":    headers.get("From", ""),
            "date":      headers.get("Date", ""),
            "snippet":   detail.get("snippet", ""),
        })
    return messages

def get_unreplied_threads(days_back: int = 5) -> list[dict]:
    """Finds email threads Lisa opened but never replied to."""
    svc = _get_service()
    # Search for threads in INBOX that are not SENT — simplified heuristic
    res = svc.users().threads().list(
        userId="me", q=f"in:inbox is:read -from:me newer_than:{days_back}d"
    ).execute()
    return res.get("threads", [])

def create_draft_reply(thread_id: str, to: str, subject: str, body: str) -> dict:
    """Creates a Gmail draft reply. Does NOT send — approval required."""
    svc = _get_service()
    message_body = f"To: {to}\nSubject: Re: {subject}\n\n{body}"
    encoded = base64.urlsafe_b64encode(message_body.encode()).decode()
    draft = svc.users().drafts().create(userId="me", body={
        "message": {"threadId": thread_id, "raw": encoded}
    }).execute()
    return {"draft_id": draft["id"], "status": "draft_created"}

def send_approved_draft(draft_id: str) -> dict:
    """Sends a previously created draft after approval."""
    svc = _get_service()
    sent = svc.users().drafts().send(userId="me", body={"id": draft_id}).execute()
    return {"message_id": sent["id"], "status": "sent"}

def send_notification_email(to: str, subject: str, body: str) -> dict:
    """Sends an automated email notification (not an agent draft)."""
    svc = _get_service()
    message_body = f"To: {to}\nSubject: {subject}\n\n{body}"
    encoded = base64.urlsafe_b64encode(message_body.encode()).decode()
    sent = svc.users().messages().send(userId="me", body={"raw": encoded}).execute()
    return {"message_id": sent["id"], "status": "sent"}
