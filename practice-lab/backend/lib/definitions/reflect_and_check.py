from ..models import MiniAppDefinition, CriterionSpec

REFLECT_AND_CHECK = MiniAppDefinition(
    id="reflect-and-check",
    name="Reflect & Check",
    skill_one_liner="Reflect what you heard, then check in to confirm.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll see a statement from a simulated conversation partner. "
        "Your job is to reflect back the essence of what they said in your own words, "
        "then end with a check-in question that genuinely invites them to correct you "
        "if you got it wrong."
    ),
    scenario_system_prompt=(
        "Generate one statement from a simulated conversation partner on a topic "
        "involving values or beliefs. The statement should be 2–4 sentences, present "
        "a coherent view, and avoid extreme or dehumanizing framing. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating a user's reflection-and-check-in response. "
        "Assess strictly on conversational skill — never on whether the user's content "
        "matches the partner's view politically or morally. "
        "Return JSON matching the supplied schema."
    ),
    criteria=[
        CriterionSpec(
            name="accuracy",
            label="Accuracy",
            description="Does the reflection capture the core of what was said?",
            rubric=(
                "Reward responses that preserve the partner's central claim and key qualifiers. "
                "Penalize additions, omissions, or distortions of meaning."
            ),
        ),
        CriterionSpec(
            name="tone",
            label="Tone",
            description="Is the reflection neutral and non-judgmental?",
            rubric=(
                "Reward neutral framing. Penalize loaded words, sarcasm, or implied judgment "
                "toward the partner's view."
            ),
        ),
        CriterionSpec(
            name="check_in_quality",
            label="Check-in quality",
            description="Is the question open and genuinely inviting correction?",
            rubric=(
                "Reward open-ended questions that invite the partner to correct the reflection. "
                "Penalize closed yes/no questions or questions that seek validation rather than "
                "correction."
            ),
        ),
        CriterionSpec(
            name="additions_or_omissions",
            label="Additions or omissions",
            description="What was added or missed compared to the original statement.",
            rubric=(
                "Identify content present in the user's reflection that was not in the partner's "
                "statement, and central content from the partner's statement that the user omitted."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
)
