"""add games table

Revision ID: ab12cd34ef56
Revises: f6e9b4ea5017
Create Date: 2026-08-06 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ab12cd34ef56'
down_revision: Union[str, Sequence[str], None] = 'f6e9b4ea5017'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('games',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('media_item_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('release_date', sa.String(), nullable=True),
    sa.Column('cover_url', sa.String(), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('genres', sa.ARRAY(sa.String()), nullable=True),
    sa.Column('storyline', sa.String(), nullable=True),
    sa.Column('summary', sa.String(), nullable=True),
    sa.Column('platforms', sa.ARRAY(sa.String()), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_games_id'), 'games', ['id'], unique=False)
    op.create_index(op.f('ix_games_media_item_id'), 'games', ['media_item_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_games_media_item_id'), table_name='games')
    op.drop_index(op.f('ix_games_id'), table_name='games')
    op.drop_table('games')
