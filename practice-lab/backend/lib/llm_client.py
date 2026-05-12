import json
import logging
import os

from google import genai
from google.genai import types

from .models import Turn

logger = logging.getLogger(__name__)


class LLMTimeoutError(Exception):
    pass


class LLMRateLimitError(Exception):
    pass


class LLMInvalidOutputError(Exception):
    def __init__(self, message: str, raw_response: str = ""):
        self.raw_response = raw_response
        super().__init__(message)


class LLMClient:
    MODEL = "gemini-2.5-flash-lite"

    def __init__(self):
        api_key = os.environ.get("GOOGLE_AI_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_AI_API_KEY environment variable not set")
        self._client = genai.Client(api_key=api_key)

    def _format_history(self, turns: list[Turn]) -> list[types.Content]:
        contents = []
        for turn in turns:
            contents.append(types.Content(
                role="user",
                parts=[types.Part(text=turn.user)],
            ))
            contents.append(types.Content(
                role="model",
                parts=[types.Part(text=turn.feedback.model_dump_json())],
            ))
        return contents

    def _map_exception(self, exc: Exception) -> Exception:
        msg = str(exc).lower()
        if "timeout" in msg or "deadline" in msg:
            return LLMTimeoutError(str(exc))
        if "429" in msg or "quota" in msg or "rate" in msg:
            return LLMRateLimitError(str(exc))
        return exc

    async def complete(self, system: str, history: list[Turn], user_msg: str) -> str:
        contents = self._format_history(history)
        contents.append(types.Content(role="user", parts=[types.Part(text=user_msg)]))
        try:
            response = await self._client.aio.models.generate_content(
                model=self.MODEL,
                contents=contents,
                config=types.GenerateContentConfig(system_instruction=system),
            )
            return response.text
        except Exception as exc:
            raise self._map_exception(exc) from exc

    async def complete_structured(
        self,
        system: str,
        history: list[Turn],
        user_msg: str,
        json_schema: dict,
    ) -> dict:
        schema_str = json.dumps(json_schema, indent=2)
        augmented_system = (
            f"{system}\n\n"
            f"Return your response as a valid JSON object matching this schema:\n{schema_str}\n\n"
            "Do not include any text outside the JSON object."
        )
        contents = self._format_history(history)
        contents.append(types.Content(role="user", parts=[types.Part(text=user_msg)]))
        try:
            response = await self._client.aio.models.generate_content(
                model=self.MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=augmented_system,
                    response_mime_type="application/json",
                ),
            )
            text = response.text
        except Exception as exc:
            raise self._map_exception(exc) from exc

        try:
            return json.loads(text)
        except json.JSONDecodeError as exc:
            raise LLMInvalidOutputError(
                f"LLM returned invalid JSON: {exc}", raw_response=text
            ) from exc

    async def complete_structured_with_repair(
        self,
        system: str,
        history: list[Turn],
        user_msg: str,
        json_schema: dict,
        failed_response: str,
    ) -> dict:
        schema_str = json.dumps(json_schema, indent=2)
        repair_msg = (
            "Your previous response was not valid JSON. "
            f"Return only a valid JSON object matching this schema:\n{schema_str}\n\n"
            "Do not include any text outside the JSON object."
        )
        contents = self._format_history(history)
        contents.append(types.Content(role="user", parts=[types.Part(text=user_msg)]))
        contents.append(types.Content(role="model", parts=[types.Part(text=failed_response)]))
        contents.append(types.Content(role="user", parts=[types.Part(text=repair_msg)]))

        augmented_system = (
            f"{system}\n\nReturn only a valid JSON object. No text outside the JSON."
        )
        try:
            response = await self._client.aio.models.generate_content(
                model=self.MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=augmented_system,
                    response_mime_type="application/json",
                ),
            )
            return json.loads(response.text)
        except json.JSONDecodeError as exc:
            raise LLMInvalidOutputError(
                f"LLM returned invalid JSON after repair: {exc}",
                raw_response=response.text,
            ) from exc
        except Exception as exc:
            raise self._map_exception(exc) from exc
