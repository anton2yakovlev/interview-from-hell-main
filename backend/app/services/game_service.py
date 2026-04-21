import re

from fastapi import HTTPException

from app.data.story import INITIAL_STATE, SCENE_MAP, START_SCENE_ID


def get_start_scene() -> dict:
    return SCENE_MAP[START_SCENE_ID]


def get_initial_state() -> dict:
    return dict(INITIAL_STATE)


def get_scene(scene_id: str) -> dict:
    scene = SCENE_MAP.get(scene_id)
    if scene is None:
        raise HTTPException(status_code=404, detail=f"Сцена '{scene_id}' не найдена")
    return scene


def _eval_condition(condition_str: str, state: dict) -> bool:
    m = re.fullmatch(r"(\w+)\s*(>=|<=|>|<|==)\s*(\d+)", condition_str.strip())
    if not m:
        return False
    field, op, value = m.group(1), m.group(2), int(m.group(3))
    v = state.get(field, 0)
    return {">=": v >= value, "<=": v <= value, ">": v > value, "<": v < value, "==": v == value}[op]


def _resolve_conditional(scene: dict, state: dict) -> str:
    for cond in scene.get("conditions", []):
        if _eval_condition(cond["condition"], state):
            return cond["next"]
    return scene.get("default", "ending_loop")


def _apply_effects(effects: dict | None, state: dict) -> dict:
    if not effects:
        return dict(state)
    result = dict(state)
    for field, delta in effects.items():
        result[field] = result.get(field, 0) + delta
    return result


def process_choice(scene_id: str, choice_id: str, state: dict) -> dict:
    scene = get_scene(scene_id)

    choice = next((c for c in scene.get("choices", []) if c["id"] == choice_id), None)
    if choice is None:
        raise HTTPException(
            status_code=400,
            detail=f"Вариант '{choice_id}' не найден в сцене '{scene_id}'",
        )

    new_state = _apply_effects(choice.get("effects"), state)
    next_scene_id = choice["next_scene_id"]
    next_scene = get_scene(next_scene_id)

    # Transparently resolve conditional scenes — never expose them to the client
    if next_scene["type"] == "conditional":
        next_scene_id = _resolve_conditional(next_scene, new_state)
        next_scene = get_scene(next_scene_id)

    return {"next_scene_id": next_scene_id, "scene": next_scene, "new_state": new_state}
