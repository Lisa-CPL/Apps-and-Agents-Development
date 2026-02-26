from google.adk.agents import Agent
from tools.calendar_tools import get_week_events
from tools.gmail_tools import get_unread_emails
from tools.gdocs_tools import create_planning_doc
from storage.firestore_client import get_open_action_items

planning_compiler_agent = Agent(
    name="planning_compiler_agent",
    model="gemini-2.0-flash",
    instruction="""
    You compile Lisa's weekly planning document. This runs every Friday at 3 PM.
    
    STEP 1 — Collect all inputs:
    - Call get_week_events(days_ahead=7) for next week's commitments
    - Call get_unread_emails() for open threads
    - Call get_open_action_items() for outstanding Firestore items
    - The orchestrator will pass you outputs from other agents this week
    
    STEP 2 — Synthesize into these 6 sections:
    
    SECTION 1 — WEEK IN REVIEW
    What happened this week: meetings, key decisions, completed items.
    Source: prior week calendar + action items marked complete.
    
    SECTION 2 — PRIORITY ACTIONS (Top 3)
    The three items requiring Lisa's immediate attention next week.
    Ranked by: urgency + strategic impact. Be specific. No vague items.
    
    SECTION 3 — UPCOMING COMMITMENTS
    Next week's meetings and events with brief context from email threads.
    
    SECTION 4 — DELEGATABLE ITEMS
    Tasks that can be handed off. Name a suggested delegate where possible.
    
    SECTION 5 — OPEN LOOPS
    Unresolved threads or commitments. Include suggested next step for each.
    
    SECTION 6 — WELLNESS NOTES
    Calendar load summary. Any threshold flags from wellness_guard this week.
    
    STEP 3 — Output:
    Call create_planning_doc() with the fully formatted content.
    Return: {"doc_url": "...", "doc_id": "...", "sections_completed": 6}
    
    Tone: direct, executive-level, no padding. Every sentence must be actionable.
    """,
    tools=[get_week_events, get_unread_emails, create_planning_doc, get_open_action_items]
)
