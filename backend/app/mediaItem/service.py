from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.anime.models import Anime
from app.manga.models import Manga
from app.games.models import Game
from app.mediaItem.model import MediaItem, MediaItemSource, MediaItemType

class MediaService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_media_item_by_id(self, media_item_id: int):
        return self.db.query(MediaItem).filter(MediaItem.id == media_item_id).first()
    
    def get_media_cached(self, source: str, external_id: str):
        return self.db.query(MediaItem).filter(
            MediaItem.external_id == str(external_id),
            MediaItem.source == source,
        ).first()
    
    def get_cached_game(self, external_id: str):
        media_item = self.get_media_cached(source=MediaItemSource.IGDB.value, external_id=external_id)

        if not media_item:
            return None
        
        return self.db.query(Game).filter(Game.media_item_id == media_item.id).first()
    
    def cache_game(self, game: Game):
        media_item = self.get_media_cached(
            source=MediaItemSource.IGDB.value,
            external_id=str(game.id),
        )
        if not media_item:
            media_item = MediaItem(
                type=MediaItemType.GAME,
                source=MediaItemSource.IGDB,
                external_id=str(game.id),
                title=game.title,
                image_url=game.cover_url,
            )
            self.db.add(media_item)
            self.db.commit()
            self.db.refresh(media_item)

        game.media_item_id = media_item.id
        self.db.add(game)
        self.db.commit()
        self.db.refresh(game)

        return game

    def get_cached_anime(self, external_id: str):
        media_item = self.get_media_cached(source=MediaItemSource.ANILIST.value, external_id=external_id)
        
        if not media_item:
            return None
        
        return self.db.query(Anime).filter(Anime.media_item_id == media_item.id).first()
    
    def cache_anime(self, anime: Anime):
        media_item = self.get_media_cached(
            source=MediaItemSource.ANILIST.value,
            external_id=str(anime.id),
        )
        if not media_item:
            media_item = MediaItem(
                type=MediaItemType.ANIME,
                source=MediaItemSource.ANILIST,
                external_id=str(anime.id),
                title=anime.romaji_title,
                image_url=anime.cover_url,
            )
            self.db.add(media_item)
            self.db.commit()
            self.db.refresh(media_item)

        anime.media_item_id = media_item.id
        self.db.add(anime)
        self.db.commit()
        self.db.refresh(anime)

        return anime

    def get_cached_manga(self, external_id: str):
        media_item = self.get_media_cached(source=MediaItemSource.ANILIST.value, external_id=external_id)

        if not media_item:
            return None

        return self.db.query(Manga).filter(Manga.media_item_id == media_item.id).first()

    def cache_manga(self, manga: Manga):
        media_item = self.get_media_cached(
            source=MediaItemSource.ANILIST.value,
            external_id=str(manga.id),
        )
        if not media_item:
            media_item = MediaItem(
                type=MediaItemType.MANGA,
                source=MediaItemSource.ANILIST,
                external_id=str(manga.id),
                title=manga.romaji_title,
                image_url=manga.cover_url,
            )
            self.db.add(media_item)
            self.db.commit()
            self.db.refresh(media_item)

        manga.media_item_id = media_item.id
        self.db.add(manga)
        self.db.commit()
        self.db.refresh(manga)

        return manga
    
