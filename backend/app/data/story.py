import json
from pathlib import Path


def _load_data() -> dict:
    path = Path(__file__).parent / "scenes.json"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    for scene in data["scenes"]:
        # Add stable IDs to choices (c0, c1, …)
        for i, choice in enumerate(scene.get("choices", [])):
            choice.setdefault("id", f"c{i}")
            # Normalize 'next' → 'next_scene_id'
            if "next" in choice and "next_scene_id" not in choice:
                choice["next_scene_id"] = choice.pop("next")
        # Normalize 'if' → 'condition' ('if' is a Python keyword)
        for cond in scene.get("conditions", []):
            if "if" in cond and "condition" not in cond:
                cond["condition"] = cond.pop("if")

    return data


_data = _load_data()

SCENES: list[dict] = _data["scenes"]
SCENE_MAP: dict[str, dict] = {s["id"]: s for s in SCENES}
START_SCENE_ID: str = _data["start_scene"]
INITIAL_STATE: dict[str, int] = dict(_data["initial_state"])
