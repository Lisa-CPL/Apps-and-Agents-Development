from ..models import CriterionSpec, MiniAppDefinition

FOLLOW_THE_THREAD = MiniAppDefinition(
    id="follow-the-thread",
    name="Follow the Thread",
    skill_one_liner="Ask a follow-up question that shows you were listening.",
    estimated_time="5–8 min",
    orientation_copy=(
        "You'll read a statement from a simulated speaker. "
        "Your job is to write one or more follow-up questions that show genuine curiosity "
        "about what they said — not challenge it, agree with it, or steer it elsewhere."
    ),
    scenario_system_prompt=(
        "Generate one statement from a simulated speaker on any topic — personal, "
        "social, or values-related. The statement should be 2–4 sentences and contain "
        "something that a curious listener would naturally want to explore further. "
        "Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating follow-up questions written in response to a speaker's statement. "
        "Assess each question on its quality as a genuine follow-up. "
        "Assess strictly on conversational skill, not on the content or direction of the topic."
    ),
    criteria=[
        CriterionSpec(
            name="connectedness",
            label="Connectedness",
            description="Does the question follow directly from something the speaker said?",
            rubric=(
                "Reward questions that pick up a specific word, phrase, or idea from the "
                "speaker's statement. Penalize questions that could have been asked regardless "
                "of what was said — they show the listener wasn't tracking."
            ),
        ),
        CriterionSpec(
            name="openness",
            label="Openness",
            description="Is the question open-ended rather than leading?",
            rubric=(
                "Reward questions that invite the speaker to expand, elaborate, or share more. "
                "Penalize questions that suggest a desired answer, contain embedded assumptions, "
                "or can be answered with yes/no."
            ),
        ),
        CriterionSpec(
            name="curiosity",
            label="Curiosity",
            description="Does the question convey genuine interest in the speaker's experience or perspective?",
            rubric=(
                "Reward questions that feel warm and genuinely interested. "
                "Penalize questions that feel perfunctory, clinical, or detached."
            ),
        ),
        CriterionSpec(
            name="disguised_argument_check",
            label="Disguised argument check",
            description="Is the question actually a challenge or argument in disguise?",
            rubric=(
                "Flag any question that implicitly disputes the speaker, expresses disagreement, "
                "or pushes the speaker toward a particular conclusion. "
                "These are debate moves, not follow-up questions, even if phrased as questions."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
)
