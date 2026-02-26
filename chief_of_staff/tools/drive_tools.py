from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token: creds.refresh(Request())
    return build("drive", "v3", credentials=creds)

def get_new_transcripts(folder_id: str = None, days_back: int = 2) -> list[dict]:
    """Finds Zoom transcript files added to Drive in the last N days."""
    from datetime import datetime, timedelta, timezone
    svc      = _get_service()
    cutoff   = (datetime.now(timezone.utc) - timedelta(days=days_back)).isoformat()
    query    = f"mimeType='text/vtt' and createdTime > '{cutoff}'"
    if folder_id:
        query += f" and '{folder_id}' in parents"
    res = svc.files().list(
        q=query, fields="files(id,name,createdTime,webViewLink)"
    ).execute()
    return res.get("files", [])

def read_transcript_text(file_id: str) -> str:
    """Downloads and returns the raw text of a Drive file."""
    svc  = _get_service()
    data = svc.files().get_media(fileId=file_id).execute()
    return data.decode("utf-8")
