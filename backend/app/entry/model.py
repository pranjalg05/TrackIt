from datetime import date, datetime, timezone
from enum import Enum

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.mediaItem.model import MediaItem


class EntryStatus(str, Enum):
    PLANNING = "planning"
    PLAN_TO_WATCH = "plan_to_watch"
    PLAN_TO_READ = "plan_to_read"
    WATCHING = "watching"
    READING = "reading"
    PLAYING = "playing"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    DROPPED = "dropped"


class Entry(Base):

    __tablename__ = "entries"
    __table_args__ = (
        UniqueConstraint("user_id", "media_item_id", name="unique_user_media_item"),
        CheckConstraint("rating is NULL OR (rating >= 0 AND rating <= 10)", name="rating_range_check")
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    media_item_id: Mapped[int] = mapped_column(ForeignKey("media_items.id", ondelete="CASCADE"), nullable=False, index=True)

    status: Mapped[str] = mapped_column(nullable=False)
    rating: Mapped[float | None] = mapped_column(nullable=True)
    notes: Mapped[str | None] = mapped_column(nullable=True)

    current_season: Mapped[int | None] = mapped_column(nullable=True)
    current_episode: Mapped[int | None] = mapped_column(nullable=True)
    current_volume: Mapped[int | None] = mapped_column(nullable=True)
    current_chapter: Mapped[int | None] = mapped_column(nullable=True)

    started_at: Mapped[date | None] = mapped_column(nullable=True)
    finished_at: Mapped[date | None] = mapped_column(nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Lazy chaining: accessing entry.media_item triggers a single JOINed load
    # instead of a separate media_item query.
    media_item: Mapped["MediaItem"] = relationship(
        "MediaItem",
        back_populates="entries",
        lazy="joined",
    )
