from ..models import MiniAppDefinition, CriterionSpec

READ_BETWEEN_THE_LINES = MiniAppDefinition(
    id="read-between-the-lines",
    name="Read Between the Lines",
    skill_one_liner="Spot language that different people might hear very differently.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll read a statement that contains one or more ambiguous or loaded phrases — "
        "words or expressions that different people might genuinely interpret in different ways. "
        "Your job is to identify the ambiguous phrase(s) and explain why different people "
        "might read them differently. There are no 'wrong' interpretations — the goal is "
        "to notice that multiple valid readings exist."
    ),
    scenario_system_prompt=(
        "Generate a statement on a social, political, or everyday topic that contains one or "
        "two genuinely ambiguous or loaded phrases — words or expressions where different "
        "people might reasonably hold different interpretations based on their background, "
        "values, or experience. The statement should be 2–3 sentences. "
        "The ambiguity should be real, not contrived. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's analysis of ambiguous language in a statement. "
        "Assess whether the user identified the genuinely ambiguous phrases and whether "
        "they explained multiple plausible interpretations without favoring any of them. "
        "Return JSON matching the supplied schema. "
        "The extras field must include any key ambiguous phrases the user missed."
    ),
    criteria=[
        CriterionSpec(
            name="identification_accuracy",
            label="Identification accuracy",
            description="Did the user find the key ambiguous phrase(s)?",
            rubric=(
                "Reward identification of the most important ambiguous terms. "
                "Penalize responses that miss the central ambiguity, identify non-ambiguous "
                "phrases, or focus on trivial word choices."
            ),
        ),
        CriterionSpec(
            name="explanation_quality",
            label="Explanation quality",
            description="Does the user articulate multiple plausible interpretations?",
            rubric=(
                "Reward responses that name at least two distinct, plausible readings and "
                "explain why different people might hold each. Penalize vague responses that "
                "say 'it could mean different things' without being specific."
            ),
        ),
        CriterionSpec(
            name="non_judgment",
            label="Non-judgment",
            description="Does the explanation treat all interpretations as valid?",
            rubric=(
                "Reward responses that present all interpretations as genuinely possible. "
                "Penalize responses that suggest one interpretation is correct, naive, or "
                "unreasonable, or that editorialize about which reading is better."
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
                "description": "Key ambiguous phrases from the statement the user did not identify.",
            },
            "example_interpretations": {
                "type": "string",
                "description": (
                    "A brief example of how one phrase from the statement might be heard "
                    "differently by two different people."
                ),
            },
        },
        "required": ["missed_phrases", "example_interpretations"],
    },
)
