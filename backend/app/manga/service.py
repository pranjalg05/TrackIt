from sqlalchemy.orm import Session

from app.manga.jikanMangaService import JikanMangaService
from app.entry.service import EntryService
from app.mediaItem.service import MediaService


class MangaServiceWrapper:
    def __init__(self, db: Session):
        self.db = db
        self.manga_service = JikanMangaService()
        self.media_service = MediaService(db=db)
        self.entry_service = EntryService(db)

    def search_manga_by_title(self, title: str, page: int = 1):
        return self.manga_service.search_manga_by_title(title, page)

    def get_manga_by_id(self, manga_id: int):
        cached_manga = self.media_service.get_cached_manga(str(manga_id))

        if cached_manga:
            return cached_manga

        return self.manga_service.get_manga_details(manga_id)

    def add_manga_to_library(self, manga_id: int, user_id: int, status: str):
        cached_manga = self.media_service.get_cached_manga(str(manga_id))

        if not cached_manga:
            manga_details = self.manga_service.get_manga_details(manga_id)
            cached_manga = self.media_service.cache_manga(manga_details)

        return self.entry_service.update_or_create_entry(
            user_id,
            cached_manga.media_item_id,
            status,
        )