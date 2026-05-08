from ..models import CriterionSpec, MiniAppDefinition

READ_BETWEEN_THE_LINES = MiniAppDefinition(
    id="read-between-the-lines",
    name="Read Between the Lines",
    skill_one_liner="Spot language that different people might hear differently.",
    estimated_time="5–8 min",
    orientation_copy=(
        "You'll see a statement containing one or more ambiguous or loaded phrases — "
        "words or expressions that different people might interpret very differently "
        "depending on their background and experiences. "
        "Your job is to identify the ambiguous phrase(s) and explain why different "
        "people might read them differently."
    ),
    scenario_system_prompt=(
        "Generate one 2–4 sentence statement that contains one or two genuinely ambiguous "
        "or loaded phrases — words or expressions with multiple plausible interpretations "
        "that vary by perspective, background, or experience. "
        "The ambiguity should be realistic, not contrived. "
        "Do not hint at the ambiguity or label it — just write the statement. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's identification and explanation of ambiguous language "
        "in a statement. Assess strictly on the skill of noticing and explaining linguistic "
        "ambiguity — not on whether the user's interpretations are 'correct'."
    ),
    criteria=[
        CriterionSpec(
            name="identification_accuracy",
            label="Identification accuracy",
            description="Did the user find the key ambiguous phrase(s)?",
            rubric=(
                "Reward responses that identify the most important ambiguous phrase(s) in the "
                "statement. Partial credit for finding one of two key phrases. "
                "Penalize responses that flag non-ambiguous language or miss the central "
                "ambiguous term entirely."
            ),
        ),
        CriterionSpec(
            name="explanation_quality",
            label="Explanation quality",
            description="Does the user articulate multiple plausible interpretations?",
            rubric=(
                "Reward responses that offer two or more distinct, plausible readings of the "
                "ambiguous phrase, grounded in real differences in perspective or background. "
                "Penalize vague explanations that don't articulate the specific different meanings."
            ),
        ),
        CriterionSpec(
            name="non_judgment",
            label="Non-judgment",
            description="Does the explanation treat all interpretations as valid?",
            rubric=(
                "Reward explanations that present each interpretation neutrally and charitably. "
                "Penalize any framing that implies one interpretation is more valid, correct, "
                "or reasonable than others."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
    extras_schema={
        "type": "object",
        "properties": {
            "missed_phrases": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Key ambiguous phrases the user did not identify.",
            },
            "example_interpretations": {
                "type": "string",
                "description": (
                    "A brief example of how one phrase might be heard differently "
                    "by different people, for the user's learning."
                ),
            },
        },
        "required": ["missed_phrases", "example_interpretations"],
    },
)
