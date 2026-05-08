from collections import Counter

from .definitions import ALL_DEFINITIONS
from .models import MiniAppDefinition


class UnknownMiniAppError(Exception):
    def __init__(self, mini_app_id: str):
        self.mini_app_id = mini_app_id
        super().__init__(f"Unknown mini-app: {mini_app_id}")


class MiniAppRegistry:
    def __init__(self, definitions: list[MiniAppDefinition]):
        self._validate_unique_ids(definitions)
        self._by_id = {d.id: d for d in definitions}

    def _validate_unique_ids(self, definitions: list[MiniAppDefinition]) -> None:
        ids = [d.id for d in definitions]
        dupes = [id for id, count in Counter(ids).items() if count > 1]
        if dupes:
            raise ValueError(f"Duplicate mini-app IDs: {dupes}")

    def list(self) -> list[MiniAppDefinition]:
        return list(self._by_id.values())

    def get(self, mini_app_id: str) -> MiniAppDefinition:
        if mini_app_id not in self._by_id:
            raise UnknownMiniAppError(mini_app_id)
        return self._by_id[mini_app_id]


REGISTRY = MiniAppRegistry(ALL_DEFINITIONS)
