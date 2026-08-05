from pydantic import BaseModel
from sqlalchemy import ARRAY, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Anime(Base):
    __tablename__ = "anime"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    media_item_id: Mapped[int] = mapped_column(nullable=False, index=True)
    id_mal: Mapped[int | None] = mapped_column(nullable=True, index=True)

    romaji_title: Mapped[str] = mapped_column(nullable=False)
    english_title: Mapped[str | None] = mapped_column(nullable=True)
    native_title: Mapped[str | None] = mapped_column(nullable=True)
    synonyms: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    status: Mapped[str | None] = mapped_column(nullable=True)
    format: Mapped[str | None] = mapped_column(nullable=True)  # TV, MOVIE, OVA, ONA, SPECIAL, TV_SHORT
    source: Mapped[str | None] = mapped_column(nullable=True)  # MANGA, ORIGINAL, LIGHT_NOVEL, etc.
    description: Mapped[str | None] = mapped_column(nullable=True)

    start_date: Mapped[str | None] = mapped_column(nullable=True)
    end_date: Mapped[str | None] = mapped_column(nullable=True)
    release_season: Mapped[str | None] = mapped_column(nullable=True)
    release_year: Mapped[int | None] = mapped_column(nullable=True)

    episodes: Mapped[int | None] = mapped_column(nullable=True)
    duration: Mapped[int | None] = mapped_column(nullable=True)

    next_episode_number: Mapped[int | None] = mapped_column(nullable=True)
    next_episode_airing_at: Mapped[int | None] = mapped_column(nullable=True)  # unix timestamp

    cover_url: Mapped[str | None] = mapped_column(nullable=True)
    banner_url: Mapped[str | None] = mapped_column(nullable=True)
    trailer_url: Mapped[str | None] = mapped_column(nullable=True)

    rating: Mapped[float | None] = mapped_column(nullable=True)
    popularity: Mapped[int | None] = mapped_column(nullable=True)
    genres: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    studios: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)


class AnimeSearchItem(BaseModel):
    id: int
    cover_url: str | None
    rating: float | None
    english_title: str | None
    romaji_title: str | None
    release_date: str | None
    popularity: int | None
    format: str | None
    status: str | None