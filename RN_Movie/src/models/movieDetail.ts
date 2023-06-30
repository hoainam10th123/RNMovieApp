export interface MovieDetail{
    poster_path: string
    backdrop_path: string
    id: number
    overview: string
    title: string
    release_date: string
    vote_average: number
    genres: genresItem[]
    videos: any
}

export interface genresItem{
    id: number
    name: string
}