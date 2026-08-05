from datetime import datetime, time

import requests
from app.config import config
from app.games.models import Game, GameSearchItem, sort_options



class IGDBService:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                "accept": "application/json",
                "Client-ID": config.TWITCH_DEVELOPER_CLIENT_ID,  # Replace with your actual Client ID
                "Authorization": f"Bearer {config.IGDB_ACCESS_TOKEN}",  # Replace with your actual Access Token
            }
        )

    def search_game_by_title(
        self,
        title: str,
    ) -> list[GameSearchItem]:
        url = "https://api.igdb.com/v4/games"

        query = (
            f'search "{title}";\n'
            "fields id, name, cover.image_id, first_release_date, total_rating, game_type;\n"
            "where game_type = (0, 4, 8, 9, 10, 11);\n"
            "limit 100;\n"
        )
        response = self.session.post(url, data=query, timeout=(10, 30))
        response.raise_for_status()
        games = response.json()
        return self._to_game_items(games)

    def _to_game_items(self, games: list[dict]) -> list[GameSearchItem]:
        game_list = []
        for game in games:
            game_id = game.get("id")
            game_name = game.get("name")
            cover_url = (
                self.get_image_url(game["cover"]["image_id"])
                if "cover" in game and "image_id" in game["cover"]
                else None
            )
            release_date = (
                datetime.fromtimestamp(game["first_release_date"]).strftime("%Y-%m-%d")
                if "first_release_date" in game
                else "Unreleased"
            )
            rating = game.get("total_rating", 0.0)

            game_list.append(
                GameSearchItem(
                    id=game_id,
                    title=game_name,
                    release_date=release_date,
                    cover_url=cover_url,
                    rating=rating,
                )
            )

        return game_list

    def get_image_url(self, image_id: str, size: str = "t_cover_big") -> str:
        """
        Constructs the full URL for an image based on its ID and desired size.

        :param image_id: The unique identifier for the image.
        :param size: The desired size of the image (default is "t_cover_big").
        :return: The full URL to access the image.
        """

        base_url = "https://images.igdb.com/igdb/image/upload/"
        return f"{base_url}{size}/{image_id}.jpg"

    def get_game_details(self, game_id: int) -> Game | None:
        url = "https://api.igdb.com/v4/games"
        query = f"fields id, name, cover.image_id, storyline, first_release_date, total_rating, summary, platforms.name, genres.name; where id = {game_id};"
        response = self.session.post(url, data=query, timeout=(10, 30))
        response.raise_for_status()
        games = response.json()

        if not games:
            return None

        game = games[0]
        cover_url = (
            self.get_image_url(game["cover"]["image_id"])
            if "cover" in game and "image_id" in game["cover"]
            else ""
        )
        release_date = (
            datetime.fromtimestamp(game["first_release_date"]).strftime("%Y-%m-%d")
            if "first_release_date" in game
            else "Unreleased"
        )
        rating = game.get("total_rating", 0.0)
        summary = game.get("summary", "")
        genres = [genre["name"] for genre in game.get("genres", [])]
        storyline = game.get("storyline", "")
        platforms = [platform["name"] for platform in game.get("platforms", [])]

        return Game(
            id=game["id"],
            media_item_id=0,  # Placeholder, should be set when creating a MediaItem
            title=game["name"],
            release_date=release_date,
            cover_url=cover_url,
            rating=rating,
            genres=genres,
            platforms=platforms,
            storyline=storyline,
            summary=summary,
        )
