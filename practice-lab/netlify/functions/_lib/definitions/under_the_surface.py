from ..models import CriterionSpec, MiniAppDefinition

UNDER_THE_SURFACE = MiniAppDefinition(
    id="under-the-surface",
    name="Under the Surface",
    skill_one_liner="Identify the values that might underlie a statement.",
    estimated_time="5–10 min",
    orientation_copy=(
        "You'll see a statement on a policy, social, or personal topic. "
        "Your job is to identify the values or moral foundations that appear to underlie it — "
        "the deeper 'why' beneath the surface position. "
        "Think about what someone who genuinely holds this view might care about deeply."
    ),
    scenario_system_prompt=(
        "Generate one 2–4 sentence statement expressing a view on a policy, social, or "
        "personal topic. The statement should be one that a thoughtful person might hold "
        "and that plausibly reflects one or more deep values or moral foundations. "
        "Avoid extremist or dehumanizing content. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's identification of the moral foundations or values "
        "underlying a statement. Assess strictly on the skill of recognizing underlying "
        "values — not on whether the user agrees or disagrees with the statement's position. "
        "Use the CPL moral foundations framework provided in the resources."
    ),
    criteria=[
        CriterionSpec(
            name="plausibility",
            label="Plausibility",
            description="Are the identified values reasonable foundations for this view?",
            rubric=(
                "Reward identifications that a thoughtful observer would recognize as genuine "
                "motivators for someone who holds this view. Penalize values that don't connect "
                "to the statement's content or that seem projected onto the speaker."
            ),
        ),
        CriterionSpec(
            name="depth",
            label="Depth",
            description="Has the user identified a deep central value, or only surface content?",
            rubric=(
                "Reward responses that go beneath the surface position to a core motivating value "
                "(e.g., identifying 'Loyalty' in a statement about national identity, "
                "not just 'nationalism'). "
                "Penalize responses that only restate the surface position without naming a value."
            ),
        ),
        CriterionSpec(
            name="plurality",
            label="Plurality",
            description="Has the user considered that more than one foundation may be present?",
            rubric=(
                "Reward responses that name multiple plausible foundations, or that acknowledge "
                "the possibility of more than one. Penalize responses that reduce a rich statement "
                "to a single value without considering other possibilities."
            ),
        ),
        CriterionSpec(
            name="non_judgment",
            label="Non-judgment",
            description="Does the user treat the identified values as genuine rather than bad faith?",
            rubric=(
                "Reward responses that treat the speaker's values as real and earnestly held, "
                "even if the user disagrees with the view. Penalize any framing that implies "
                "the values are a cover story, manipulative, or illegitimate."
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
                    "A brief explanation of why recognizing moral foundations matters "
                    "for this specific statement and conversation context."
                ),
            },
        },
        "required": ["overlooked_foundations", "why_it_matters"],
    },
)
