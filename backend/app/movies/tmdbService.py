import requests

from app.config import config
from app.movies.models import MovieItem, MovieSearchItem


class TMDBService:

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                "accept": "application/json",
                "Authorization": f"Bearer {config.TMDB_API_READ_ACCESS_TOKEN}",
            }
        )

    def search_movie_by_title(self, title: str):
        url = f"https://api.themoviedb.org/3/search/movie?query={title}"
        response = self.session.get(url, timeout=(10, 30))
        response.raise_for_status()
        movies = response.json().get("results", [])

        if not movies:
            return []

        movieItems: list[MovieItem] = []

        for movie in movies:
            movieItems.append(
                MovieSearchItem(
                    id=movie.get("id"),
                    title=movie.get("title"),
                    poster_url=(
                        f"{config.TMDB_IMAGE_BASE}{movie.get('poster_path')}"
                        if movie.get("poster_path")
                        else None
                    ),
                    rating=movie.get("vote_average"),
                    release_date=movie.get("release_date"),
                )
            )

        return movieItems

    def get_movie_by_id(self, movie_id: int):
        url = f"https://api.themoviedb.org/3/movie/{movie_id}"
        response = self.session.get(url, timeout=(10, 30))
        response.raise_for_status()
        movie = response.json()

        return MovieItem(
            id=movie.get("id"),
            title=movie.get("title"),
            poster_url=(
                f"{config.TMDB_IMAGE_BASE}{movie.get('poster_path')}"
                if movie.get("poster_path")
                else None
            ),
            rating=movie.get("vote_average"),
            release_date=movie.get("release_date"),
            genres=[genre["name"] for genre in movie.get("genres", [])],
            overview=movie.get("overview"),
            runtime=movie.get("runtime"),
            backdrop_url=(
                f"{config.TMDB_IMAGE_BASE}{movie.get('backdrop_path')}"
                if movie.get("backdrop_path")
                else None
            ),
            production_companies=[
                company["name"] for company in movie.get("production_companies", [])
            ],
            adult=movie.get("adult"),
        )
