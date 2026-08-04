
export interface GameSearchItem {
    id: number,
    title: string,
    release_date: string,
    cover_url: string,
    rating: number
}

export interface GameDetailItem {
    id: number,
    title: string,
    release_date: string,
    cover_url: string,
    rating: number,
    genres: string[],
    platforms: string[]
    storyline: string
    summary: string
}
