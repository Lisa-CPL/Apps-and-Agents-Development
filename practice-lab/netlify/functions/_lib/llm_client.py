import json
import os

from google import genai
from google.genai import types

from .exceptions import LLMInvalidOutputError, LLMTimeoutError, RateLimitError

_DEFAULT_MODEL = "gemini-2.5-flash-lite"


class LLMClient:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Error: GEMINI_API_KEY environment variable not set")
        self._client = genai.Client(api_key=api_key)

    def complete(self, system: str, user_msg: str) -> str:
        """Plain-text completion. Returns the response text."""
        try:
            response = self._client.models.generate_content(
                model=_DEFAULT_MODEL,
                contents=user_msg,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                ),
            )
            text = response.text
            if not text:
                raise LLMInvalidOutputError()
            return text
        except (LLMTimeoutError, RateLimitError, LLMInvalidOutputError):
            raise
        except Exception as e:
            self._handle_error(e)

    def complete_json(self, system: str, user_msg: str) -> dict:
        """JSON completion with one repair retry on parse failure."""
        raw = self._call_json(system, user_msg)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            repair_system = (
                system
                + "\n\nCRITICAL: Your previous response was not valid JSON. "
                "Return ONLY a valid JSON object. No markdown fences, no preamble, "
                "no trailing text — just the JSON."
            )
            raw = self._call_json(repair_system, user_msg)
            try:
                return json.loads(raw)
            except json.JSONDecodeError as exc:
                raise LLMInvalidOutputError() from exc

    def _call_json(self, system: str, user_msg: str) -> str:
        try:
            response = self._client.models.generate_content(
                model=_DEFAULT_MODEL,
                contents=user_msg,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    response_mime_type="application/json",
                ),
            )
            text = response.text
            if not text:
                raise LLMInvalidOutputError()
            return text
        except (LLMTimeoutError, RateLimitError, LLMInvalidOutputError):
            raise
        except Exception as e:
            self._handle_error(e)

    def _handle_error(self, e: Exception) -> None:
        err_str = str(e).lower()
        if "timeout" in err_str or "deadline" in err_str:
            raise LLMTimeoutError() from e
        if "rate" in err_str or "quota" in err_str or "429" in err_str:
            raise RateLimitError() from e
        raise LLMInvalidOutputError() from e
