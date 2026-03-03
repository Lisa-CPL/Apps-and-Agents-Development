import os
from dotenv import load_dotenv

load_dotenv()

# GCP
GCP_PROJECT = os.getenv("GCP_PROJECT", "cpl-chief-of-staff-system")
GCP_REGION = os.getenv("GCP_REGION", "us-central1")

# Notifications
NOTIFICATION_EMAIL = os.getenv("NOTIFICATION_EMAIL", "")
PENDING_APPROVAL_DOC = os.getenv("PENDING_APPROVAL_DOC", "")
PLANNING_DOC_FOLDER = os.getenv("PLANNING_DOC_FOLDER", "")

# CPL team classification keywords
CPL_TEAM_KEYWORDS = {
    "team_outreach": ["outreach", "canvassing", "doors", "volunteers", "field"],
    "team_events": ["event", "venue", "meetup", "registration", "rsvp", "ticket"],
    "team_comms": ["press", "media", "newsletter", "social", "website", "statement"],
    "team_policy": ["policy", "legislation", "bill", "amendment", "vote"],
    "team_operations": ["budget", "finance", "admin", "operations", "logistics", "invoice"],
}

BOOK_KEYWORDS = [
    "book", "publisher", "author", "speaking", "interview",
    "podcast", "review", "manuscript", "agent", "keynote", "blurb",
]

# Wellness thresholds
WELLNESS_MAX_MEETING_HOURS = 4
WELLNESS_BACK_TO_BACK_LIMIT = 3
WELLNESS_NO_LUNCH_DAYS = 3

# Reply age threshold in hours
UNREPLIED_HOURS_THRESHOLD = 48
