from pydantic import BaseModel
from sqlalchemy import ARRAY, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Manga(Base):
    __tablename__ = "manga"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    media_item_id: Mapped[int] = mapped_column(nullable=False, index=True)

    romaji_title: Mapped[str] = mapped_column(nullable=False)
    english_title: Mapped[str | None] = mapped_column(nullable=True)
    native_title: Mapped[str | None] = mapped_column(nullable=True)
    synonyms: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    description: Mapped[str | None] = mapped_column(nullable=True)
    background: Mapped[str | None] = mapped_column(nullable=True)

    status: Mapped[str | None] = mapped_column(nullable=True)
    type: Mapped[str | None] = mapped_column(nullable=True)  # Manga, Novel, Manhwa, Manhua, One-shot, Doujinshi

    start_date: Mapped[str | None] = mapped_column(nullable=True)
    end_date: Mapped[str | None] = mapped_column(nullable=True)
    release_year: Mapped[int | None] = mapped_column(nullable=True)

    chapters: Mapped[int | None] = mapped_column(nullable=True)
    volumes: Mapped[int | None] = mapped_column(nullable=True)

    cover_url: Mapped[str | None] = mapped_column(nullable=True)
    banner_url: Mapped[str | None] = mapped_column(nullable=True)

    rating: Mapped[float | None] = mapped_column(nullable=True)  # MAL score, already /10
    scored_by: Mapped[int | None] = mapped_column(nullable=True)
    rank: Mapped[int | None] = mapped_column(nullable=True)
    popularity_rank: Mapped[int | None] = mapped_column(nullable=True)
    members: Mapped[int | None] = mapped_column(nullable=True)
    favorites: Mapped[int | None] = mapped_column(nullable=True)

    genres: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    themes: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    demographics: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    authors: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    serializations: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)


class MangaSearchItem(BaseModel):
    id: int
    cover_url: str | None
    rating: float | None
    english_title: str | None
    romaji_title: str | None
    release_date: str | None
    members: int | None
    chapters: int | None
    volumes: int | None
    type: str | None
    status: str | None