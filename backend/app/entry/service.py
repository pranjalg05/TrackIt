from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.anime.models import Anime
from app.entry.model import Entry, EntryStatus
from app.mediaItem.model import MediaItem, MediaItemType


SORT_MAP = {
    "title": MediaItem.title,
    "rating": Entry.rating,
    "updated_at": Entry.updated_at,
}


class EntryService:
    def __init__(self, db: Session):
        self.db = db

    def _serialize(self, entry: Entry) -> dict:
        media = entry.media_item
        total_episodes = None
        if media.type == MediaItemType.ANIME.value:
            anime = self.db.query(Anime).filter(Anime.media_item_id == media.id).first()
            total_episodes = anime.episodes if anime else None
        return {
            "id": entry.id,
            "media_item_id": media.id,
            "status": entry.status,
            "rating": entry.rating,
            "notes": entry.notes,
            "title": media.title,
            "image_url": media.image_url,
            "type": media.type,
            "source": media.source,
            "external_id": media.external_id,
            "current_episode": entry.current_episode,
            "total_episodes": total_episodes,
            "started_at": entry.started_at.isoformat() if entry.started_at else None,
            "finished_at": entry.finished_at.isoformat() if entry.finished_at else None,
            "updated_at": entry.updated_at.isoformat() if entry.updated_at else None,
        }

    def _apply_completed_progress(self, entry: Entry):
        if entry.status != EntryStatus.COMPLETED.value:
            return
        if entry.media_item.type != MediaItemType.ANIME.value:
            return
        anime = self.db.query(Anime).filter(Anime.media_item_id == entry.media_item_id).first()
        if anime and anime.episodes:
            entry.current_episode = anime.episodes

    def get_entry_by_id(self, entry_id: int, user_id: int | None = None):
        query = self.db.query(Entry).filter(Entry.id == entry_id)
        if user_id is not None:
            query = query.filter(Entry.user_id == user_id)

        entry = query.first()

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        return entry

    def get_user_entries(
        self,
        user_id: int,
        sort: str | None = None,
        order: str = "desc",
        min_rating: float | None = None,
        max_rating: float | None = None,
        media_type: str | None = None,
    ):
        query = self.db.query(Entry).filter(Entry.user_id == user_id)

        if media_type:
            query = query.join(MediaItem, Entry.media_item_id == MediaItem.id).filter(
                MediaItem.type == media_type
            )

        if min_rating is not None:
            query = query.filter(Entry.rating >= min_rating)
        if max_rating is not None:
            query = query.filter(Entry.rating <= max_rating)

        sort_col = SORT_MAP.get(sort, Entry.updated_at)
        sort_col = sort_col.asc() if order == "asc" else sort_col.desc()
        if sort == "rating":
            sort_col = sort_col.nulls_last()

        entries = query.order_by(sort_col).all()

        return [self._serialize(entry) for entry in entries]

    def get_user_entry_by_external(self, user_id: int, source: str, external_id: str):
        entry = (
            self.db.query(Entry)
            .join(MediaItem, Entry.media_item_id == MediaItem.id)
            .filter(
                Entry.user_id == user_id,
                MediaItem.source == source,
                MediaItem.external_id == str(external_id),
            )
            .first()
        )

        return self._serialize(entry) if entry else None

    def create_entry(self, user_id: int, media_item_id: int, status: str):
        existing = self.db.query(Entry).filter(
            Entry.user_id == user_id,
            Entry.media_item_id == media_item_id,
        ).first()

        if existing:
            raise HTTPException(status_code=409, detail="Entry already exists")

        new_entry = Entry(
            user_id=user_id,
            media_item_id=media_item_id,
            status=status,
        )
        self.db.add(new_entry)
        self.db.commit()
        self.db.refresh(new_entry)
        self._apply_completed_progress(new_entry)
        self.db.commit()
        self.db.refresh(new_entry)
        return self._serialize(new_entry)

    def update_or_create_entry(self, user_id: int, media_item_id: int, status: str):
        entry = self.db.query(Entry).filter(
            Entry.user_id == user_id,
            Entry.media_item_id == media_item_id,
        ).first()

        if entry:
            entry.status = status
            self._apply_completed_progress(entry)
            self.db.commit()
            self.db.refresh(entry)
            return self._serialize(entry)

        return self.create_entry(user_id, media_item_id, status)

    def update_entry_status(self, entry_id: int, user_id: int, status: str):
        entry = self.db.query(Entry).filter(
            Entry.id == entry_id,
            Entry.user_id == user_id,
        ).first()

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        entry.status = status
        self._apply_completed_progress(entry)
        self.db.commit()
        self.db.refresh(entry)

        return self._serialize(entry)

    def update_entry_rating(self, entry_id: int, user_id: int, rating: float):
        entry = self.db.query(Entry).filter(
            Entry.id == entry_id,
            Entry.user_id == user_id,
        ).first()

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        entry.rating = round(rating, 1)
        self.db.commit()
        self.db.refresh(entry)

        return self._serialize(entry)

    def update_entry_note(self, entry_id: int, user_id: int, note: str | None):
        entry = self.db.query(Entry).filter(
            Entry.id == entry_id,
            Entry.user_id == user_id,
        ).first()

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        entry.notes = note.strip() if note and note.strip() else None
        self.db.commit()
        self.db.refresh(entry)

        return self._serialize(entry)

    def update_entry_current_episode(self, entry_id: int, user_id: int, current_episode: int):
        entry = self.db.query(Entry).filter(
            Entry.id == entry_id,
            Entry.user_id == user_id,
        ).first()

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        if current_episode < 0:
            raise HTTPException(status_code=422, detail="Episode count cannot be negative")

        entry.current_episode = current_episode
        self.db.commit()
        self.db.refresh(entry)

        return self._serialize(entry)