from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session

from app.manga.service import MangaServiceWrapper
from app.auth.dependencies import get_current_user_id
from app.database import get_db

router = APIRouter(prefix="/manga", tags=["manga"])


def get_manga_service(db: Session = Depends(get_db)):
    return MangaServiceWrapper(db)


@router.get("/search")
def search_manga(
    title: str = Query(...),
    page: int = Query(1),
    manga_service: MangaServiceWrapper = Depends(get_manga_service),
):
    """
    Search for manga by title using the MangaDex API.
    """
    return manga_service.search_manga_by_title(title, page)


@router.post("/{manga_id}/library")
def add_manga_to_library(
    manga_id: int,
    status: str = Body(..., embed=True),
    user_id: int = Depends(get_current_user_id),
    manga_service: MangaServiceWrapper = Depends(get_manga_service),
):
    """
    Add a manga to the authenticated user's library.
    """
    return manga_service.add_manga_to_library(manga_id, user_id, status)


@router.get("/{manga_id}")
def get_manga_by_id(
    manga_id: int,
    manga_service: MangaServiceWrapper = Depends(get_manga_service),
):
    return manga_service.get_manga_by_id(manga_id)