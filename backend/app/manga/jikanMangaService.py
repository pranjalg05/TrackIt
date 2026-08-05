from fastapi import HTTPException
import requests

from app.manga.models import Manga, MangaSearchItem


class JikanMangaService:
    def __init__(self):
        self.base_url = "https://api.jikan.moe/v4/"
        self.timeout = 20

    def _get(self, path: str, params: dict) -> dict:
        try:
            response = requests.get(f"{self.base_url}{path}", params=params, timeout=self.timeout)
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Could not reach Jikan API")

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Manga not found")

        if response.status_code == 429:
            raise HTTPException(status_code=429, detail="Jikan rate limit hit, please retry shortly")

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Error fetching data from Jikan API",
            )

        return response.json()

    @staticmethod
    def _cover_url(images: dict) -> str | None:
        jpg = images.get("jpg", {}) if images else {}
        return jpg.get("large_image_url") or jpg.get("image_url")

    @staticmethod
    def _date_str(date_obj: dict | None) -> str | None:
        if not date_obj:
            return None
        iso = date_obj.get("from") or date_obj.get("to")
        return iso.split("T")[0] if iso else None

    @staticmethod
    def _names(items: list[dict] | None) -> list[str] | None:
        if not items:
            return None
        return [item["name"] for item in items if item.get("name")]

    def search_manga_by_title(self, title: str, page: int = 1, limit: int = 12):
        data = self._get(
            "/manga",
            params={"q": title, "page": page, "limit": limit},
        )

        manga_list = []
        for manga in data.get("data", []):
            manga_list.append(
                MangaSearchItem(
                    id=manga["mal_id"],
                    cover_url=self._cover_url(manga.get("images", {})),
                    rating=manga.get("score"),
                    english_title=manga.get("title_english"),
                    romaji_title=manga.get("title"),
                    release_date=self._date_str(manga.get("published")),
                    members=manga.get("members"),
                    chapters=manga.get("chapters"),
                    volumes=manga.get("volumes"),
                    type=manga.get("type"),
                    status=manga.get("status"),
                )
            )
        return manga_list

    def get_manga_details(self, manga_id: int):
        data = self._get(f"/manga/{manga_id}", params={})
        manga = data["data"]

        published = manga.get("published") or {}

        return Manga(
            id=manga["mal_id"],
            romaji_title=manga.get("title") or "",
            english_title=manga.get("title_english"),
            native_title=manga.get("title_japanese"),
            synonyms=manga.get("title_synonyms") or None,
            description=manga.get("synopsis"),
            background=manga.get("background"),
            status=manga.get("status"),
            type=manga.get("type"),
            start_date=self._date_str({"from": published.get("from")}),
            end_date=self._date_str({"from": published.get("to")}),
            release_year=(
                int(published["from"][:4]) if published.get("from") else None
            ),
            chapters=manga.get("chapters"),
            volumes=manga.get("volumes"),
            cover_url=self._cover_url(manga.get("images", {})),
            banner_url=None,  # Jikan has no banner image for manga
            rating=manga.get("score"),
            scored_by=manga.get("scored_by"),
            rank=manga.get("rank"),
            popularity_rank=manga.get("popularity"),
            members=manga.get("members"),
            favorites=manga.get("favorites"),
            genres=self._names(manga.get("genres")),
            themes=self._names(manga.get("themes")),
            demographics=self._names(manga.get("demographics")),
            authors=self._names(manga.get("authors")),
            serializations=self._names(manga.get("serializations")),
        )