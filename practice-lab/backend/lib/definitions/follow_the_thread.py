from ..models import MiniAppDefinition, CriterionSpec

FOLLOW_THE_THREAD = MiniAppDefinition(
    id="follow-the-thread",
    name="Follow the Thread",
    skill_one_liner="Ask a follow-up question that deepens the conversation.",
    estimated_time="5–10 minutes",
    orientation_copy=(
        "You'll read a statement from a simulated speaker. "
        "Your job is to write one or more follow-up questions that show genuine curiosity "
        "about what they said — questions that invite them to share more, not questions "
        "that challenge or redirect."
    ),
    scenario_system_prompt=(
        "Generate one statement from a simulated speaker sharing a perspective, experience, "
        "or belief. The statement should be 2–4 sentences and leave natural threads to follow — "
        "aspects that a curious listener might want to explore further. "
        "Avoid extreme content. Do not include any preamble — return only the statement."
    ),
    evaluation_system_prompt=(
        "You are evaluating follow-up questions written in response to a speaker's statement. "
        "Assess each question strictly on conversational skill. "
        "A question may be strong on some criteria and weak on others — assess each independently. "
        "Return JSON matching the supplied schema."
    ),
    criteria=[
        CriterionSpec(
            name="connectedness",
            label="Connectedness",
            description="Does the question follow directly from what the speaker said?",
            rubric=(
                "Reward questions that pick up on specific words, ideas, or threads from the "
                "statement. Penalize questions that could have been asked before hearing the "
                "statement, or that redirect to an unrelated topic."
            ),
        ),
        CriterionSpec(
            name="openness",
            label="Openness",
            description="Is the question open-ended rather than leading?",
            rubric=(
                "Reward questions that allow the speaker to answer in many directions. "
                "Penalize questions that embed an assumption, push toward a particular answer, "
                "or are answerable with a simple yes or no."
            ),
        ),
        CriterionSpec(
            name="curiosity",
            label="Curiosity",
            description="Does the question seem genuinely interested in the speaker's perspective?",
            rubric=(
                "Reward questions that seek to understand the speaker's experience, reasoning, "
                "or values. Penalize questions that feel mechanical, perfunctory, or dismissive."
            ),
        ),
        CriterionSpec(
            name="disguised_argument_check",
            label="Disguised argument check",
            description="Is the question actually a challenge or argument in disguise?",
            rubric=(
                "Flag questions that use interrogative form to make a point rather than seek "
                "understanding — e.g., 'Don't you think that's a bit extreme?' or "
                "'How can you believe that when…?'. These are debate moves, not follow-up questions."
            ),
        ),
    ],
    ip_resources=["neutrality_norms.md", "feedback_tone_rubric.md"],
)
