from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.entry.service import EntryService
from app.mediaItem.service import MediaService
from app.movies.tmdbService import TMDBService

class MovieService:
    def __init__(self, db: Session):
        self.tmdb_service = TMDBService()
        self.media_service = MediaService(db=db)
        self.entry_service = EntryService(db)

    def search_movie_by_title(self, title: str):
        return self.tmdb_service.search_movie_by_title(title)

    def get_movie_by_id(self, movie_id: int):
        return self.tmdb_service.get_movie_by_id(movie_id)

    def add_movie_to_library(self, movie_id: int, user_id: int, status: str, rating: float | None = None):
        movie = self.tmdb_service.get_movie_by_id(movie_id)

        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")

        media_item = self.media_service.cache_movie(movie)

        return self.entry_service.update_or_create_entry(
            user_id,
            media_item.id,
            status,
            rating,
        )
