from ..models import MiniAppDefinition, CriterionSpec

SAY_IT_WITH_CONTEXT = MiniAppDefinition(
    id="say-it-with-context",
    name="Say It With Context",
    skill_one_liner="Share your view with enough context to invite curiosity.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll be given a topic or question. Your job is to write a statement sharing "
        "your view on it — with enough context (your reasoning, experience, or values) "
        "that someone with a different view would feel curious rather than defensive. "
        "The goal is not to convince anyone, but to share in a way that opens a door."
    ),
    scenario_system_prompt=(
        "Generate a topic or open question on a values- or beliefs-related subject that "
        "a person might have a genuine view on. The topic should be specific enough that "
        "someone can write a 2–4 sentence response sharing their perspective, but open "
        "enough that reasonable people hold different views. "
        "Avoid topics that are purely factual. "
        "Do not include any preamble — return only the topic or question."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's statement sharing their view on a topic. "
        "Assess strictly on conversational skill — never on whether the view itself is "
        "correct, reasonable, or one you agree with. "
        "A statement that shares a controversial view can still score highly if it does so "
        "skillfully. Return JSON matching the supplied schema."
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
                "Reward statements that ground the view in personal experience, specific "
                "reasoning, or named values. Penalize bare assertions that state a position "
                "without any 'why' behind it."
            ),
        ),
        CriterionSpec(
            name="invitation",
            label="Invitation",
            description="Does the statement leave room for engagement?",
            rubric=(
                "Reward statements that acknowledge other views exist, use tentative language "
                "where appropriate, or explicitly invite the listener's perspective. "
                "Penalize statements that are presented as final verdicts or that implicitly "
                "close the conversation."
            ),
        ),
        CriterionSpec(
            name="tone",
            label="Tone",
            description="Is the statement assertive without being dismissive?",
            rubric=(
                "Reward confident, clear statements that do not hedge so much they say nothing. "
                "Penalize dismissive language toward people who disagree, condescension, "
                "or language that implies the listener is wrong by default."
            ),
        ),
        CriterionSpec(
            name="curiosity_inducing",
            label="Curiosity-inducing",
            description="Would a listener with a different view want to ask a follow-up?",
            rubric=(
                "Reward statements that contain threads worth pulling — specific claims, "
                "named experiences, or articulated values that invite questions. "
                "Penalize vague, generic statements that give a listener nothing to engage with."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
)
