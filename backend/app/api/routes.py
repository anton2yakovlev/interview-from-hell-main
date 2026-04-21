from fastapi import APIRouter

from app.schemas.game import ChoiceRequest, ChoiceResponse, Scene, StartResponse
from app.services.game_service import (
    get_initial_state,
    get_scene,
    get_start_scene,
    process_choice,
)

router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/scenes/start", response_model=StartResponse)
def start_scene():
    return {"scene": get_start_scene(), "initial_state": get_initial_state()}


@router.get("/scenes/{scene_id}", response_model=Scene)
def scene(scene_id: str):
    return get_scene(scene_id)


@router.post("/scenes/{scene_id}/choose", response_model=ChoiceResponse)
def choose(scene_id: str, body: ChoiceRequest):
    return process_choice(scene_id, body.choice_id, body.state.model_dump())
