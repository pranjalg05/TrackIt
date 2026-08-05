from fastapi import HTTPException
import requests

from app.anime.models import AnimeSearchItem, Anime


class AniListService:
    def __init__(self):
        self.base_url = "https://graphql.anilist.co"
        self.timeout = 10

    def _post(self, query: str, variables: dict) -> dict:
        try:
            response = requests.post(
                self.base_url,
                json={"query": query, "variables": variables},
                timeout=self.timeout,
            )
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Could not reach AniList API")

        if response.status_code == 429:
            retry_after = response.headers.get("Retry-After", "60")
            raise HTTPException(
                status_code=429,
                detail=f"AniList rate limit hit, retry after {retry_after}s",
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Error fetching data from AniList API",
            )

        payload = response.json()
        if payload.get("errors"):
            raise HTTPException(
                status_code=400,
                detail=payload["errors"][0].get("message", "AniList query error"),
            )

        return payload["data"]

    @staticmethod
    def _format_date(date_obj: dict | None) -> str | None:
        if not date_obj or not (date_obj.get("year") and date_obj.get("month") and date_obj.get("day")):
            return None
        return f"{date_obj['year']}-{date_obj['month']:02d}-{date_obj['day']:02d}"

    def search_anime_by_title(self, title: str, page: int = 1):
        query = """
        query ($search: String, $page: Int) {
            Page(page: $page, perPage: 12) {
                media(search: $search, type: ANIME) {
                    id
                    coverImage { extraLarge }
                    averageScore
                    popularity
                    format
                    status
                    title { romaji english }
                    startDate { year month day }
                }
            }
        }
        """
        data = self._post(query, {"search": title, "page": page})

        anime_list = []
        for anime in data["Page"]["media"]:
            anime_list.append(
                AnimeSearchItem(
                    id=anime["id"],
                    cover_url=anime["coverImage"]["extraLarge"],
                    rating=(anime["averageScore"] / 10) if anime["averageScore"] is not None else None,
                    english_title=anime["title"]["english"],
                    romaji_title=anime["title"]["romaji"],
                    release_date=self._format_date(anime["startDate"]),
                    popularity=anime["popularity"],
                    format=anime["format"],
                    status=anime["status"],
                )
            )
        return anime_list

    def get_anime_details(self, anime_id: int):
        query = """
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                id
                idMal
                title { romaji english native }
                synonyms
                description
                status
                format
                source
                startDate { year month day }
                endDate { year month day }
                season
                seasonYear
                episodes
                duration
                nextAiringEpisode { episode airingAt }
                coverImage { extraLarge }
                bannerImage
                trailer { id site }
                averageScore
                popularity
                genres
                studios(isMain: true) {
                    nodes { name }
                }
            }
        }
        """
        data = self._post(query, {"id": anime_id})
        anime_data = data["Media"]

        if anime_data is None:
            raise HTTPException(status_code=404, detail="Anime not found")

        trailer_url = None
        if anime_data.get("trailer") and anime_data["trailer"].get("site") == "youtube":
            trailer_url = f"https://www.youtube.com/watch?v={anime_data['trailer']['id']}"

        next_ep = anime_data.get("nextAiringEpisode") or {}

        return Anime(
            id=anime_data["id"],
            id_mal=anime_data["idMal"],
            romaji_title=anime_data["title"]["romaji"],
            english_title=anime_data["title"]["english"],
            native_title=anime_data["title"]["native"],
            synonyms=anime_data["synonyms"],
            description=anime_data["description"],
            status=anime_data["status"],
            format=anime_data["format"],
            source=anime_data["source"],
            start_date=self._format_date(anime_data["startDate"]),
            end_date=self._format_date(anime_data["endDate"]),
            release_season=anime_data["season"],
            release_year=anime_data["seasonYear"],
            episodes=anime_data["episodes"],
            duration=anime_data["duration"],
            next_episode_number=next_ep.get("episode"),
            next_episode_airing_at=next_ep.get("airingAt"),
            cover_url=anime_data["coverImage"]["extraLarge"],
            banner_url=anime_data["bannerImage"],
            trailer_url=trailer_url,
            rating=(anime_data["averageScore"] / 10) if anime_data["averageScore"] is not None else None,
            popularity=anime_data["popularity"],
            genres=anime_data["genres"],
            studios=[s["name"] for s in anime_data["studios"]["nodes"]],
        )