from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user_id
from app.database import get_db
from app.entry.service import EntryService


router = APIRouter(prefix="/entry", tags=["entries"])

def get_entry_service(db: Session = Depends(get_db)):
    return EntryService(db)


@router.post("")
def create_entry(
    media_item_id: int = Body(...),
    status: str = Body(...),
    rating: float | None = Body(None),
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
):
    """
    Create a new library entry for the authenticated user.
    """
    return entry_service.create_entry(user_id, media_item_id, status, rating)


@router.get("")
def get_user_entries(
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
    sort: str | None = Query(None, description="Sort by field: 'rating', 'updated_at'"),
    order: str = Query("desc", description="Sort order, 'asc' or 'desc'"),
    min_rating: float | None = Query(None, description="Minimum rating (inclusive)"),
    max_rating: float | None = Query(None, description="Maximum rating (inclusive)"),
    type: str | None = Query(None, description="Filter by media type: movie, tv_show, game, manga, anime"),
):
    """
    Get all library entries for the authenticated user.
    """
    return entry_service.get_user_entries(
        user_id,
        sort=sort,
        order=order,
        min_rating=min_rating,
        max_rating=max_rating,
        media_type=type,
    )


@router.get("/check")
def check_user_entry(
    source: str = Query(..., description="Media source, e.g. tmdb or igdb"),
    external_id: str = Query(..., description="External id of the media item"),
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
):
    """
    Return the authenticated user's entry for a media item, or null if not in the library.
    """
    return entry_service.get_user_entry_by_external(user_id, source, external_id)


@router.patch("/{entry_id}/status")
def update_entry_status(
    entry_id: int,
    status: str = Body(..., embed=True),
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
):
    """
    Update the status of a library entry for the authenticated user.
    """
    return entry_service.update_entry_status(entry_id, user_id, status)

@router.patch("/{entry_id}/rating")
def update_entry_rating(
    entry_id: int,
    rating: float = Body(..., embed=True),
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
):
    """
    Update the rating of a library entry for the authenticated user.
    """
    return entry_service.update_entry_rating(entry_id, user_id, rating)

@router.patch("/{entry_id}/note")
def update_entry_note(
    entry_id: int,
    note: str | None = Body(None, embed=True),
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
):
    """
    Update the note of a library entry for the authenticated user.
    """
    return entry_service.update_entry_note(entry_id, user_id, note)

@router.patch("/{entry_id}/episode")
def update_entry_current_episode(
    entry_id: int,
    current_episode: int = Body(..., embed=True),
    user_id: int = Depends(get_current_user_id),
    entry_service: EntryService = Depends(get_entry_service),
):
    """
    Update the current episode progress of a library entry for the authenticated user.
    """
    return entry_service.update_entry_current_episode(entry_id, user_id, current_episode)
