class PracticeLabError(Exception):
    def __init__(self, code: str, message: str, status: int):
        self.code = code
        self.message = message
        self.status = status
        super().__init__(message)


class UnknownMiniAppError(PracticeLabError):
    def __init__(self, mini_app_id: str):
        super().__init__(
            code="mini_app_not_found",
            message=f"Mini-app '{mini_app_id}' not found.",
            status=404,
        )


class BadRequestError(PracticeLabError):
    def __init__(self, message: str):
        super().__init__(code="bad_request", message=message, status=400)


class LLMTimeoutError(PracticeLabError):
    def __init__(self):
        super().__init__(code="llm_timeout", message="LLM call timed out.", status=504)


class LLMInvalidOutputError(PracticeLabError):
    def __init__(self):
        super().__init__(
            code="llm_invalid_output",
            message="LLM returned malformed output after retry.",
            status=502,
        )


class RateLimitError(PracticeLabError):
    def __init__(self):
        super().__init__(
            code="rate_limited",
            message="Rate limit reached. Try again in a moment.",
            status=429,
        )
