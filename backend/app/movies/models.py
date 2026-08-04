
from itertools import product
from platform import release

from h11 import PRODUCT_ID
from pydantic import BaseModel
from sqlalchemy import over

TMDB_MOVIE_GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
}

class MovieItem(BaseModel):
    id: int
    title: str
    poster_url: str | None
    rating: float | None
    release_date: str | None
    genres: list[str] | None
    overview: str | None
    runtime: int | None
    backdrop_url: str | None
    adult: bool | None
    production_companies: list[str] | None
    
class MovieSearchItem(BaseModel):
    id: int
    title: str
    poster_url: str | None
    rating: float | None
    release_date: str | None