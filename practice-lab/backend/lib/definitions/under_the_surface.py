from ..models import MiniAppDefinition, CriterionSpec

UNDER_THE_SURFACE = MiniAppDefinition(
    id="under-the-surface",
    name="Under the Surface",
    skill_one_liner="Identify the values that might underlie what someone said.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll read a statement on a policy, social, or personal topic. "
        "Your job is to identify the values or moral foundations that appear to underlie it — "
        "the deeper commitments that might explain why someone would hold this view. "
        "You're not judging whether the view is right or wrong. "
        "You're practicing the skill of recognizing what someone cares about beneath what they say."
    ),
    scenario_system_prompt=(
        "Generate a 2–3 sentence statement that someone might make on a policy, social, or "
        "personal topic. The statement should reflect one or more underlying values or moral "
        "commitments without naming them explicitly — the values should be inferrable but not "
        "stated. Avoid extreme or dehumanizing content. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's identification of the moral foundations underlying a "
        "statement. Assess whether the user identified plausible values, went beyond the "
        "surface content to find deeper commitments, and treated those values as genuine "
        "rather than as bad faith. "
        "Never assess whether the underlying view is correct or desirable. "
        "Return JSON matching the supplied schema. "
        "The extras field must list any significant moral foundations the user overlooked."
    ),
    criteria=[
        CriterionSpec(
            name="plausibility",
            label="Plausibility",
            description="Are the identified values reasonable given the statement?",
            rubric=(
                "Reward identifications that a thoughtful listener would recognize as plausible "
                "interpretations of the statement. Penalize identifications that seem projected "
                "onto the statement rather than derived from it."
            ),
        ),
        CriterionSpec(
            name="depth",
            label="Depth",
            description="Did the user get beneath the surface content to the deeper central value?",
            rubric=(
                "Reward responses that name the underlying moral commitment, not just restate "
                "the surface claim. For example, 'they care about fairness' is deeper than "
                "'they think this policy is unfair.' Penalize responses that only paraphrase "
                "the statement."
            ),
        ),
        CriterionSpec(
            name="plurality",
            label="Plurality",
            description="Did the user consider that more than one foundation may be present?",
            rubric=(
                "Reward responses that identify multiple possible foundations or acknowledge "
                "that the statement may draw on more than one value. "
                "Penalize responses that insist on a single value when multiple are plausible."
            ),
        ),
        CriterionSpec(
            name="non_judgment",
            label="Non-judgment",
            description="Does the user treat the identified values as genuine rather than as bad faith?",
            rubric=(
                "Reward responses that name the values without editorializing. "
                "Penalize responses that characterize the underlying values as wrong, naive, "
                "cynical, or otherwise delegitimize them."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md", "moral_foundations.md"],
    extras_schema={
        "type": "object",
        "properties": {
            "overlooked_foundations": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Moral foundations the user did not consider that are plausibly present.",
            },
            "why_it_matters": {
                "type": "string",
                "description": (
                    "A brief explanation of why recognizing moral foundations is useful "
                    "for conversation."
                ),
            },
        },
        "required": ["overlooked_foundations", "why_it_matters"],
    },
)
