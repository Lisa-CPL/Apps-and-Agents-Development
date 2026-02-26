from google.adk.agents import Agent
from tools.drive_tools import get_new_transcripts, read_transcript_text
from tools.slack_tools import draft_slack_message
from storage.firestore_client import save_action_items

transcript_router_agent = Agent(
    name="transcript_router_agent",
    model="gemini-2.0-flash",
    instruction="""
    You process new Zoom meeting transcripts from Google Drive.
    
    STEP 1 — Find transcripts
    Call get_new_transcripts() to find any transcript files added in the last 48 hours.
    If none found, return {"status": "no_new_transcripts"}.
    
    STEP 2 — For each transcript:
    Call read_transcript_text(file_id) to retrieve the full text.
    
    STEP 3 — Extract from the transcript:
    a) Meeting name and approximate date
    b) List of speakers / attendees
    c) Key decisions made (clear resolution reached)
    d) Action items in this exact format: WHO | WHAT | BY WHEN
    e) Open questions with no resolution
    f) Which CPL team this meeting belongs to (use speakers + meeting name as signals)
    
    STEP 4 — Draft a Slack summary message for the identified team channel.
    Format:
    *Meeting Summary — [Meeting Name] — [Date]*
    *Decisions:* ...
    *Action Items:*
    > [WHO] | [WHAT] | [BY WHEN]
    *Open Questions:* ...
    
    STEP 5 — Return structured output:
    {
      "transcript_file": "...",
      "meeting_name": "...",
      "team": "team_1 | team_2 | ...",
      "action_items": [{who, what, by_when}],
      "slack_draft": "full message text",
      "target_channel": "channel_name",
      "pending_approval": true
    }
    
    Do NOT post to Slack. Return draft only — posting requires Lisa approval.
    """,
    tools=[get_new_transcripts, read_transcript_text]
)
