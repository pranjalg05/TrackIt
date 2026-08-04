from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user_id
from app.database import get_db
from app.movies.service import MovieService


router = APIRouter(prefix="/movie", tags=["Movies"])

def get_movie_service(db: Session = Depends(get_db)):
    return MovieService(db=db)


@router.get("/search")
async def search_movies(title: str = Query(..., description="The title of the movie to search for"), movie_service: MovieService = Depends(get_movie_service)):
    """
    Search for movies by title using the TMDB API.
    """
    return movie_service.search_movie_by_title(title)


@router.post("/{movie_id}/library")
def add_movie_to_library(
    movie_id: int,
    status: str = Body(...),
    rating: float | None = Body(None),
    user_id: int = Depends(get_current_user_id),
    movie_service: MovieService = Depends(get_movie_service),
):
    """
    Add a movie to the authenticated user's library.
    """
    return movie_service.add_movie_to_library(movie_id, user_id, status, rating)


@router.get("/{movie_id}")
async def get_movie(movie_id: int, movie_service: MovieService = Depends(get_movie_service)):
    """
    Get movie details by TMDB ID.
    """
    return movie_service.get_movie_by_id(movie_id)