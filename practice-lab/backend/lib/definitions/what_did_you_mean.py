from ..models import MiniAppDefinition, CriterionSpec

WHAT_DID_YOU_MEAN = MiniAppDefinition(
    id="what-did-you-mean",
    name="What Did You Mean by That?",
    skill_one_liner="Ask a clarifying question that seeks understanding, not challenge.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll read a statement that contains an unclear term, claim, or assertion — "
        "something that could mean several different things. "
        "Your job is to write a clarifying question that genuinely seeks to understand "
        "what the speaker meant. The goal is clarity, not challenge. "
        "A good clarifying question sounds curious, not skeptical."
    ),
    scenario_system_prompt=(
        "Generate a 1–3 sentence statement that contains at least one unclear term, vague "
        "claim, or ambiguous assertion — something that a listener genuinely might not "
        "understand without more information. The statement should be on an everyday, social, "
        "or values-related topic. It should not be extreme or dehumanizing. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a clarifying question written in response to a statement. "
        "Assess whether the question seeks genuine understanding, targets something "
        "that is actually unclear, and avoids the patterns of debate or challenge. "
        "Return JSON matching the supplied schema. "
        "The extras field must flag whether the question contains debate-move patterns."
    ),
    criteria=[
        CriterionSpec(
            name="relevance",
            label="Relevance",
            description="Does the question target a genuinely unclear part of the statement?",
            rubric=(
                "Reward questions aimed at terms or claims that are actually ambiguous or "
                "underspecified in the statement. Penalize questions about things that are "
                "already clear, or that focus on peripheral rather than central unclear elements."
            ),
        ),
        CriterionSpec(
            name="tone",
            label="Tone",
            description="Is the question curious rather than skeptical or adversarial?",
            rubric=(
                "Reward questions that sound genuinely interested in understanding. "
                "Penalize questions that sound suspicious, accusatory, or that imply the "
                "speaker should justify themselves."
            ),
        ),
        CriterionSpec(
            name="openness",
            label="Openness",
            description="Is the question open-ended rather than leading?",
            rubric=(
                "Reward questions that allow the speaker to define their own meaning. "
                "Penalize questions that embed an assumed answer, suggest the 'right' "
                "answer, or are easily answered yes/no."
            ),
        ),
        CriterionSpec(
            name="distinction_from_debate_moves",
            label="Distinction from debate moves",
            description="Is this genuine clarification or a veiled argument?",
            rubric=(
                "Flag questions that use the form of clarification to make a point — e.g., "
                "'When you say X, do you mean [obviously wrong interpretation]?' or "
                "'Are you really claiming that…?' These are debate moves, not clarifying questions."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
    extras_schema={
        "type": "object",
        "properties": {
            "debate_move_detected": {
                "type": "boolean",
                "description": "True if the question contains a disguised debate-move pattern.",
            },
            "debate_move_explanation": {
                "type": "string",
                "description": (
                    "If debate_move_detected is true, explain what the debate-move pattern is "
                    "and suggest an alternative phrasing. Empty string if not detected."
                ),
            },
        },
        "required": ["debate_move_detected", "debate_move_explanation"],
    },
)
