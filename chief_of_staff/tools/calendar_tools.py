from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from datetime import datetime, timedelta, timezone

def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token: creds.refresh(Request())
    return build("calendar", "v3", credentials=creds)

def get_week_events(days_ahead: int = 7) -> list[dict]:
    """Returns calendar events for the next N days with duration in minutes."""
    svc  = _get_service()
    now  = datetime.now(timezone.utc)
    end  = now + timedelta(days=days_ahead)
    res  = svc.events().list(
        calendarId="primary",
        timeMin=now.isoformat(),
        timeMax=end.isoformat(),
        singleEvents=True,
        orderBy="startTime"
    ).execute()
    events = []
    for e in res.get("items", []):
        start = e["start"].get("dateTime", e["start"].get("date"))
        end_t = e["end"].get("dateTime",   e["end"].get("date"))
        events.append({
            "id":       e["id"],
            "summary":  e.get("summary", "(no title)"),
            "start":    start,
            "end":      end_t,
            "location": e.get("location", ""),
            "attendees": [a["email"] for a in e.get("attendees", [])],
        })
    return events

def calculate_daily_load(events: list[dict]) -> dict:
    """Groups events by date and sums meeting hours per day."""
    from collections import defaultdict
    daily = defaultdict(list)
    for e in events:
        date = e["start"][:10]  # YYYY-MM-DD
        daily[date].append(e)
    return dict(daily)
