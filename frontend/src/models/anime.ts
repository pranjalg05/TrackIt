export interface AnimeSearchItem {
    id: number;
    cover_url: string | null;
    rating: number | null;
    english_title: string | null;
    romaji_title: string;
    release_date: string | null;
    popularity: number | null;
    format: string | null;
    status: string | null;
}

export interface AnimeDetailItem {
    id: number;
    romaji_title: string;
    english_title: string | null;
    native_title: string | null;
    synonyms: string[] | null;
    status: string | null;
    format: string | null;
    source: string | null;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    release_season: string | null;
    release_year: number | null;
    episodes: number | null;
    duration: number | null;
    next_episode_number: number | null;
    next_episode_airing_at: number | null;
    cover_url: string | null;
    banner_url: string | null;
    trailer_url: string | null;
    rating: number | null;
    popularity: number | null;
    genres: string[] | null;
    studios: string[] | null;
}
