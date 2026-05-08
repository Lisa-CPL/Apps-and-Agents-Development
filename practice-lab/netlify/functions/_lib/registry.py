from .definitions import ALL_DEFINITIONS
from .exceptions import UnknownMiniAppError
from .models import MiniAppDefinition


class MiniAppRegistry:
    def __init__(self, definitions: list[MiniAppDefinition]):
        self._by_id: dict[str, MiniAppDefinition] = {}
        for d in definitions:
            if d.id in self._by_id:
                raise ValueError(f"Duplicate mini-app id: {d.id!r}")
            self._by_id[d.id] = d

    def list(self) -> list[MiniAppDefinition]:
        return list(self._by_id.values())

    def get(self, mini_app_id: str) -> MiniAppDefinition:
        if mini_app_id not in self._by_id:
            raise UnknownMiniAppError(mini_app_id)
        return self._by_id[mini_app_id]


REGISTRY = MiniAppRegistry(ALL_DEFINITIONS)
