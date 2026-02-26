from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from config import EVENTS_SPREADSHEET_ID, EVENTS_SHEET_RANGE

def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token: creds.refresh(Request())
    return build("sheets", "v4", credentials=creds)

def get_sheet_events() -> list[dict]:
    """Reads event rows from the master Google Sheet.
    Expected columns: Title | Date | Time | Location | Description | Meetup URL
    """
    svc  = _get_service()
    res  = svc.spreadsheets().values().get(
        spreadsheetId=EVENTS_SPREADSHEET_ID,
        range=EVENTS_SHEET_RANGE
    ).execute()
    rows = res.get("values", [])
    keys = ["title", "date", "time", "location", "description", "meetup_url"]
    return [dict(zip(keys, row + [""] * (len(keys) - len(row)))) for row in rows]
