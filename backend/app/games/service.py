from sqlalchemy.orm import Session

from app.entry.service import EntryService
from app.games.igdbService import IGDBService
from app.mediaItem.service import MediaService


class GameService:
    def __init__(self, db: Session):
        self.db = db
        self.igdb_service = IGDBService()
        self.media_service = MediaService(db)
        self.entry_service = EntryService(db)
        
    def search_game_by_title(self, title: str ):
        return self.igdb_service.search_game_by_title(title)  
    
    def get_game_details(self, game_id: int):        
        cached_game = self.media_service.get_cached_game(str(game_id))
        
        if cached_game:
            return cached_game
        
        return self.igdb_service.get_game_details(game_id)
    
    def add_game_to_library(self, game_id: int, user_id: int, status: str):

        cached_game = self.media_service.get_cached_game(str(game_id))

        if not cached_game:
            game_details = self.igdb_service.get_game_details(game_id)
            cached_game = self.media_service.cache_game(game_details)

        return self.entry_service.update_or_create_entry(
            user_id,
            cached_game.media_item_id,
            status,
        )
