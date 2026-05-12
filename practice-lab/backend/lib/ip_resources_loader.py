from pathlib import Path

_IP_RESOURCES_DIR = Path(__file__).parent / "ip_resources"


class IPResourceLoader:
    def load(self, filename: str) -> str:
        path = _IP_RESOURCES_DIR / filename
        if not path.exists():
            raise FileNotFoundError(f"IP resource not found: {filename}")
        return path.read_text(encoding="utf-8")

    def load_many(self, filenames: list[str]) -> str:
        if not filenames:
            return ""
        parts = [f"# {fn}\n{self.load(fn)}" for fn in filenames]
        return "\n\n".join(parts)
