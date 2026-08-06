from pydantic import BaseModel
from sqlalchemy import ARRAY, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    media_item_id: Mapped[int] = mapped_column(nullable=False, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    release_date: Mapped[str | None] = mapped_column(nullable=True)
    cover_url: Mapped[str | None] = mapped_column(nullable=True)
    rating: Mapped[float | None] = mapped_column(nullable=True)
    genres: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    storyline: Mapped[str | None] = mapped_column(nullable=True)
    summary: Mapped[str | None] = mapped_column(nullable=True)
    platforms: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    
class GameSearchItem(BaseModel):
    id: int
    title: str
    release_date: str
    cover_url: str | None
    rating: float

sort_options = {
    "rating": "total_rating",
    "release_date": "first_release_date",
}
