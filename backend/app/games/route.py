from turtle import title

from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user_id
from app.database import get_db
from app.games.service import GameService


router = APIRouter(prefix="/game", tags=["games"])

def get_game_service(db: Session = Depends(get_db)):
    return GameService(db)

@router.get("/search")
def search_game(
    title: str = Query(..., description="The title of the game to search for"),
    game_service: GameService = Depends(get_game_service),
):
    """
    Search for games by title using the IGDB API.
    """
    return game_service.search_game_by_title(title)

@router.post("/{game_id}/library")
def add_game_to_library(
    game_id: int,
    status: str = Body(..., embed=True),
    user_id: int = Depends(get_current_user_id),
    game_service: GameService = Depends(get_game_service),
):
    """
    Add a game to the authenticated user's library.
    """
    return game_service.add_game_to_library(game_id, user_id, status)


@router.get("/{game_id}")
def get_game_details(game_id: int, game_service: GameService = Depends(get_game_service)):
    """
    Get detailed information about a specific game by its ID.
    """
    return game_service.get_game_details(game_id)