from datetime import datetime, timezone, date
from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ARRAY, String, UniqueConstraint

from app.database import Base


class MediaItemType(str, Enum):
    MOVIE = "movie"
    TV_SHOW = "tv_show"
    GAME = "game"
    MANGA = "manga"
    ANIME = "anime"
    
class MediaItemSource(str, Enum):
    TMDB = "tmdb"
    IGDB = "igdb"
    MAL = "mal"

class MediaItem(Base):
    __tablename__ = "media_items"
    __table_args__ = (UniqueConstraint("type", "source", "external_id", name="unique_media_item"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str] = mapped_column(nullable=False)
    source: Mapped[str] = mapped_column(nullable=False)
    external_id: Mapped[str] = mapped_column(index=True, nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    image_url: Mapped[str | None] = mapped_column(nullable=True)

    entries: Mapped[list["Entry"]] = relationship(
        "Entry",
        back_populates="media_item",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
