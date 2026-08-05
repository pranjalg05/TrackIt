
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from app.anime.service import AnimeService
from app.auth.dependencies import get_current_user_id
from app.database import get_db


router = APIRouter(prefix="/anime", tags=["anime"])

def get_anime_service(db: Session = Depends(get_db)):
    return AnimeService(db)
    
@router.get("/search")
def search_anime(title: str, anime_service = Depends(get_anime_service), page: int = 1):
    """
    Search for anime by title using the Jikan API.
    """
    return anime_service.search_anime_by_title(title, page)

@router.post("/{anime_id}/library")
def add_anime_to_library(
    anime_id: int,
    status: str = Body(..., embed=True),
    user_id: int = Depends(get_current_user_id),
    anime_service = Depends(get_anime_service),
):
    """
    Add an anime to the authenticated user's library.
    """
    return anime_service.add_anime_to_library(anime_id, user_id, status)

@router.get("/{anime_id}")
def get_anime_by_id(anime_id: str, anime_service = Depends(get_anime_service)):
    return anime_service.get_anime_by_id(int(anime_id));