import re
from .models import FeedbackPayload

# Phrases indicating the AI is rendering moral verdicts on content (not skill)
_MORAL_VERDICT_PHRASES = [
    "you're wrong about",
    "the correct view is",
    "you are incorrect",
    "in reality,",
    "the truth is",
    "that's not true",
    "that is not true",
    "factually incorrect",
    "you should believe",
]

# Patterns indicating the AI is speaking as a first-person opinion-holder
_FIRST_PERSON_AI_PATTERNS = [
    r"\bI think\b",
    r"\bI believe\b",
    r"\bI disagree\b",
    r"\bin my opinion\b",
    r"\bI would argue\b",
]

# Hate-speech patterns for scenario safety checks
_HATE_PATTERNS = [
    "kill all",
    "death to",
    "exterminate",
    "should be eliminated",
]

# Political-side terms (to be expanded by CPL)
_POLITICAL_SIDE_TERMS: list[str] = []


class SafetyChecker:
    def check_scenario(self, scenario: str) -> None:
        """Raises ValueError if the scenario contains prohibited content."""
        lower = scenario.lower()
        for pattern in _HATE_PATTERNS:
            if pattern in lower:
                raise ValueError(f"Scenario contains prohibited content.")

    def check_feedback(self, payload: FeedbackPayload) -> bool:
        """Returns True if feedback passes all neutrality checks."""
        text = self._collect_feedback_text(payload)
        lower = text.lower()

        for phrase in _MORAL_VERDICT_PHRASES:
            if phrase in lower:
                return False

        for pattern in _FIRST_PERSON_AI_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return False

        for term in _POLITICAL_SIDE_TERMS:
            if term.lower() in lower:
                return False

        return True

    def _collect_feedback_text(self, payload: FeedbackPayload) -> str:
        parts = [payload.suggestion]
        for c in payload.criteria:
            if c.what_worked:
                parts.append(c.what_worked)
            if c.what_to_improve:
                parts.append(c.what_to_improve)
        for v in payload.extras.values():
            if isinstance(v, str):
                parts.append(v)
            elif isinstance(v, list):
                parts.extend(str(item) for item in v)
        return " ".join(parts)
