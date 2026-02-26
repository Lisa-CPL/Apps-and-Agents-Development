import os
from dotenv import load_dotenv

load_dotenv()

# GCP
GCP_PROJECT = os.getenv("GCP_PROJECT", "cpl-chief-of-staff")
GCP_REGION  = os.getenv("GCP_REGION",  "us-central1")

# Google Workspace
GMAIL_USER          = os.getenv("GMAIL_USER")           # lisas email address
EVENTS_SPREADSHEET_ID = os.getenv("EVENTS_SPREADSHEET_ID") # Sheet ID from URL
EVENTS_SHEET_RANGE  = "Events!A2:F100"
PLANNING_DOC_FOLDER = os.getenv("PLANNING_DOC_FOLDER")  # Drive folder ID

# Meetup
MEETUP_API_KEY    = os.getenv("MEETUP_API_KEY")
MEETUP_GROUP_NAME = os.getenv("MEETUP_GROUP_NAME")      # CPL Meetup group URL name

# Slack
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_CHANNELS = {
    "team_1": os.getenv("SLACK_TEAM1_CHANNEL"),
    "team_2": os.getenv("SLACK_TEAM2_CHANNEL"),
    "team_3": os.getenv("SLACK_TEAM3_CHANNEL"),
    "team_4": os.getenv("SLACK_TEAM4_CHANNEL"),
    "team_5": os.getenv("SLACK_TEAM5_CHANNEL"),
    "general": os.getenv("SLACK_GENERAL_CHANNEL"),
}

# Wellness thresholds (configurable)
WELLNESS_MEETING_HOURS_PER_DAY = 4     # WARNING threshold
WELLNESS_BACK_TO_BACK_LIMIT    = 3     # consecutive meetings
WELLNESS_NO_LUNCH_DAYS_LIMIT   = 3     # days in a row

# Approval gate
PENDING_APPROVAL_DOC_ID = os.getenv("PENDING_APPROVAL_DOC_ID")
PENDING_APPROVAL_EMAIL  = os.getenv("PENDING_APPROVAL_EMAIL")
