from ..models import CriterionSpec, MiniAppDefinition

SAY_IT_WITH_CONTEXT = MiniAppDefinition(
    id="say-it-with-context",
    name="Say It With Context",
    skill_one_liner="Share your view with enough context to invite curiosity.",
    estimated_time="5–10 min",
    orientation_copy=(
        "You'll be given a topic or question. Your job is to write a statement "
        "sharing your view on it — but with enough context (your experience, values, "
        "or reasoning) that someone who sees it differently would understand where "
        "you're coming from and feel curious to ask more."
    ),
    scenario_system_prompt=(
        "Generate one open-ended topic or question on which reasonable people hold "
        "genuinely different views. The topic should be substantive enough for a person "
        "to share a meaningful perspective, but not so extreme or inflammatory that "
        "it invites only tribal responses. "
        "Format: return only the topic as a one-sentence prompt (e.g., 'What do you think "
        "about the role of tradition in modern society?'). No preamble."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's view-sharing statement. The user was asked to share "
        "their perspective on a topic with enough context to invite curiosity. "
        "Assess strictly on the conversational skill of sharing views with context — "
        "never on whether the view itself is correct, wise, or politically appropriate."
    ),
    criteria=[
        CriterionSpec(
            name="context",
            label="Context",
            description=(
                "Does the statement include enough background — experience, values, or "
                "reasoning — to explain where the view comes from?"
            ),
            rubric=(
                "Reward statements that give a reason, story, or value behind the view. "
                "Penalize bare assertions with no 'because', no grounding, no 'what shaped this'. "
                "The best responses let the listener understand the speaker as a person, not just a position."
            ),
        ),
        CriterionSpec(
            name="invitation",
            label="Invitation",
            description="Does the statement leave room for the other person to engage?",
            rubric=(
                "Reward statements that end with or imply openness: an invitation to respond, "
                "an acknowledgment that others see it differently, or a genuine question. "
                "Penalize statements that close the conversation down or imply the topic is settled."
            ),
        ),
        CriterionSpec(
            name="tone",
            label="Tone",
            description="Is the statement assertive without being dismissive?",
            rubric=(
                "Reward confident but open tone. Penalize dismissiveness of other views, "
                "hedging so extreme it reads as spineless, or aggression that shuts down dialogue."
            ),
        ),
        CriterionSpec(
            name="curiosity_inducing",
            label="Curiosity-inducing",
            description="Would a listener with a different view want to ask a follow-up?",
            rubric=(
                "Reward statements that give a listener something to engage with — a specific "
                "reason, an interesting value framing, a lived-experience hook. "
                "Penalize statements that feel closed, preachy, or like a debate opening move "
                "that doesn't invite dialogue."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
)
