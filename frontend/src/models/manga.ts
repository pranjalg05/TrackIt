export interface MangaSearchItem {
    id: number;
    cover_url: string | null;
    rating: number | null;
    english_title: string | null;
    romaji_title: string;
    release_date: string | null;
    members: number | null;
    chapters: number | null;
    volumes: number | null;
    type: string | null;
    status: string | null;
}

export interface MangaDetailItem {
    id: number;
    romaji_title: string;
    english_title: string | null;
    native_title: string | null;
    synonyms: string[] | null;
    description: string | null;
    background: string | null;
    status: string | null;
    type: string | null;
    start_date: string | null;
    end_date: string | null;
    release_year: number | null;
    chapters: number | null;
    volumes: number | null;
    cover_url: string | null;
    banner_url: string | null;
    rating: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity_rank: number | null;
    members: number | null;
    favorites: number | null;
    genres: string[] | null;
    themes: string[] | null;
    demographics: string[] | null;
    authors: string[] | null;
    serializations: string[] | null;
}