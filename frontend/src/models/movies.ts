export interface MovieItem {
    id: number;
    title: string;
    poster_url?: string;
    rating?: number;
    release_date?: string;
    genres?: string[];
    overview?: string;
    runtime?: number;
    backdrop_url?: string;
    adult?: boolean;
    production_companies?: string[];
}

export interface MovieSearchItem {
    id: number;
    title: string;
    poster_url?: string;
    rating?: number;
    release_date?: string;
}
