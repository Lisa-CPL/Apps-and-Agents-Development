from datetime import datetime, timedelta, timezone
from collections import defaultdict

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


def _get_service():
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open("token.json", "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("calendar", "v3", credentials=creds)


def get_week_events(days_ahead: int = 7, days_back: int = 7) -> dict:
    """Return past and upcoming calendar events as two lists."""
    svc = _get_service()
    now = datetime.now(timezone.utc)

    def fetch(start, end):
        res = svc.events().list(
            calendarId="primary",
            timeMin=start.isoformat(),
            timeMax=end.isoformat(),
            singleEvents=True,
            orderBy="startTime",
        ).execute()
        events = []
        for e in res.get("items", []):
            start_v = e["start"].get("dateTime", e["start"].get("date", ""))
            end_v = e["end"].get("dateTime", e["end"].get("date", ""))
            events.append(
                {
                    "summary": e.get("summary", "(no title)"),
                    "start": start_v,
                    "end": end_v,
                    "location": e.get("location", ""),
                    "attendees": [a["email"] for a in e.get("attendees", []) if "email" in a],
                }
            )
        return events

    return {
        "past": fetch(now - timedelta(days=days_back), now),
        "upcoming": fetch(now, now + timedelta(days=days_ahead)),
    }


def calculate_daily_load(events: list[dict]) -> dict:
    """Calculate total meeting hours per day."""
    daily = defaultdict(list)
    for e in events:
        date = e["start"][:10] if len(e.get("start", "")) >= 10 else e.get("start", "")
        daily[date].append(e)

    summary = {}
    for date, day_events in daily.items():
        mins = 0
        for ev in day_events:
            try:
                if "T" in ev["start"]:
                    s = datetime.fromisoformat(ev["start"].replace("Z", "+00:00"))
                    x = datetime.fromisoformat(ev["end"].replace("Z", "+00:00"))
                    mins += int((x - s).total_seconds() // 60)
            except Exception:
                continue
        summary[date] = {"events": day_events, "total_hours": round(mins / 60, 1)}
    return summary
