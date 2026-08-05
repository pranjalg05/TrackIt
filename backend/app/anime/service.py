from sqlalchemy.orm import Session

from app.anime.anilistService import AniListService
from app.entry.service import EntryService
from app.mediaItem.service import MediaService


class AnimeService:
    def __init__(self, db: Session):
        self.db = db
        self.anilist_service = AniListService()
        self.media_service = MediaService(db=db)
        self.entry_service = EntryService(db)
        
    def search_anime_by_title(self, title: str, page: int = 1):
        return self.anilist_service.search_anime_by_title(title, page)
    
    def get_anime_by_id(self, anime_id: int):
        cached_game = self.media_service.get_cached_anime(str(anime_id))
                
        if cached_game:
            return cached_game
            
        return self.anilist_service.get_anime_details(anime_id)
    
    def add_anime_to_library(self, anime_id: int, user_id: int, status: str):

        cached_anime = self.media_service.get_cached_anime(str(anime_id))

        if not cached_anime:
            anime_details = self.anilist_service.get_anime_details(anime_id)
            cached_anime = self.media_service.cache_anime(anime_details)

        return self.entry_service.update_or_create_entry(
            user_id,
            cached_anime.media_item_id,
            status,
        )