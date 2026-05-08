import os

_IP_DIR = os.path.join(os.path.dirname(__file__), "ip_resources")


class IPResourceLoader:
    def load(self, filename: str) -> str:
        path = os.path.join(_IP_DIR, filename)
        if not os.path.exists(path):
            return ""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def load_many(self, filenames: list[str]) -> str:
        parts = []
        for filename in filenames:
            content = self.load(filename)
            if content:
                parts.append(f"--- {filename} ---\n{content}")
        return "\n\n".join(parts)
