from typing import Optional
from pydantic import BaseModel


class Choice(BaseModel):
    id: str
    text: str
    next_scene_id: str
    effects: Optional[dict[str, int]] = None


class Scene(BaseModel):
    id: str
    type: str
    speaker: Optional[str] = None
    text: Optional[str] = None
    choices: list[Choice] = []


class GameState(BaseModel):
    loyalty: int = 0
    doubt: int = 0
    fatigue: int = 0


class StartResponse(BaseModel):
    scene: Scene
    initial_state: GameState


class ChoiceRequest(BaseModel):
    choice_id: str
    state: GameState


class ChoiceResponse(BaseModel):
    next_scene_id: str
    scene: Scene
    new_state: GameState
