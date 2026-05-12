import logging
import re

from .models import FeedbackPayload

logger = logging.getLogger(__name__)

# Phrases indicating the AI is judging the user's content rather than their skill.
# These lists need CPL curation — defaults are conservative starters.
_MORAL_VERDICT_PATTERNS = [
    r"you(?:'re| are) wrong about",
    r"the correct view is",
    r"in reality,",
    r"that(?:'s| is) incorrect",
    r"you are mistaken",
    r"actually that",
]

_FIRST_PERSON_PATTERNS = [
    r"\bI think\b",
    r"\bI believe\b",
    r"\bI disagree\b",
    r"\bin my opinion\b",
]

# CPL to supply the authoritative list; this is a minimal placeholder.
_POLITICAL_SIDE_PATTERNS: list[str] = []

_HATE_SPEECH_PATTERNS = [
    r"\b(subhuman|vermin|parasites?)\b",
]


def _matches_any(text: str, patterns: list[str]) -> str | None:
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            return p
    return None


class SafetyChecker:
    def check_scenario(self, scenario: str) -> bool:
        pattern = _matches_any(scenario, _HATE_SPEECH_PATTERNS)
        if pattern:
            logger.warning("Scenario failed hate-speech check: pattern=%s", pattern)
            return False
        return True

    def check_feedback(self, feedback: FeedbackPayload) -> bool:
        all_text = " ".join(filter(None, [
            *(c.what_worked for c in feedback.criteria),
            *(c.what_to_improve for c in feedback.criteria),
            feedback.suggestion,
        ]))

        for patterns, label in [
            (_MORAL_VERDICT_PATTERNS, "moral-verdict"),
            (_FIRST_PERSON_PATTERNS, "first-person"),
            (_POLITICAL_SIDE_PATTERNS, "political-side"),
        ]:
            pattern = _matches_any(all_text, patterns)
            if pattern:
                logger.warning("Feedback failed %s check: pattern=%s", label, pattern)
                return False

        return True
