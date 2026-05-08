from ..models import CriterionSpec, MiniAppDefinition

WHAT_DID_YOU_MEAN = MiniAppDefinition(
    id="what-did-you-mean",
    name="What Did You Mean by That?",
    skill_one_liner="Ask a clarifying question that seeks understanding, not victory.",
    estimated_time="5–8 min",
    orientation_copy=(
        "You'll see a statement containing an unclear term, claim, or assertion. "
        "Your job is to write one clarifying question that seeks genuine understanding — "
        "not to challenge the statement, expose its flaws, or win a debate. "
        "A good clarifying question makes the speaker feel heard, not interrogated."
    ),
    scenario_system_prompt=(
        "Generate one 1–3 sentence statement containing a term, claim, or assertion that "
        "is genuinely unclear and would benefit from clarification. "
        "The unclear element should be something a reasonable listener might want to understand "
        "better — not an obvious error or strawman. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a clarifying question written in response to a statement. "
        "Assess whether the question seeks genuine understanding or is a disguised debate move. "
        "Assess strictly on conversational skill — never on the content of the topic."
    ),
    criteria=[
        CriterionSpec(
            name="relevance",
            label="Relevance",
            description="Does the question target a genuinely unclear part of the statement?",
            rubric=(
                "Reward questions that ask about a real ambiguity or gap in the statement. "
                "Penalize questions that target something already clear, or that are "
                "disconnected from the statement's content."
            ),
        ),
        CriterionSpec(
            name="tone",
            label="Tone",
            description="Is the question curious rather than skeptical or adversarial?",
            rubric=(
                "Reward questions that feel genuinely curious and non-threatening. "
                "Penalize questions that carry skepticism, mockery, or implied disagreement "
                "in their framing."
            ),
        ),
        CriterionSpec(
            name="openness",
            label="Openness",
            description="Is the question open-ended rather than leading?",
            rubric=(
                "Reward questions that invite the speaker to explain on their own terms. "
                "Penalize questions that push toward a specific answer or embed an assumption "
                "in the framing."
            ),
        ),
        CriterionSpec(
            name="distinction_from_debate_moves",
            label="Genuine clarification vs. debate move",
            description="Is this a sincere clarifying question, or a veiled argument?",
            rubric=(
                "Flag questions that function as challenges, 'gotcha' moves, or attempts to "
                "force the speaker into a contradiction. These include rhetorical questions, "
                "questions designed to expose an inconsistency, and 'just asking questions' "
                "that are clearly challenges in disguise."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
    extras_schema={
        "type": "object",
        "properties": {
            "debate_move_detected": {
                "type": "boolean",
                "description": "True if the question functions as a debate move rather than genuine clarification.",
            },
            "suggested_alternative": {
                "type": "string",
                "description": "An alternative phrasing that achieves clarification without the debate-move pattern, if one was detected. Empty string if none needed.",
            },
        },
        "required": ["debate_move_detected", "suggested_alternative"],
    },
)
