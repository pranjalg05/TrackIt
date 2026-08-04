import { BASE_URL } from './../libs/config';
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../clients/apiClient";
import type { EntryItem } from "@/models/entries";
import type { MovieItem, MovieSearchItem } from '../models/movies';

const MOVIE_BASE = "/movie";

export const useSearchMovieByTitle = (title: string) => {
    return useQuery({
        queryKey: ["searchMovieByTitle", title],
        queryFn: async (): Promise<MovieSearchItem[]> => {
            const response = apiClient.get(`${BASE_URL}${MOVIE_BASE}/search`, {
                params: { title },
            });
            return (await response).data;
        },
        enabled: Boolean(title.trim()), // Only run the query if the title is not empty
    });
}

export const useGetMovieById = (id: number) => {
    return useQuery({
        queryKey: ["getMovieById", id],
        queryFn: async (): Promise<MovieItem> => {
            const response = apiClient.get(`${BASE_URL}${MOVIE_BASE}/${id}`);
            return (await response).data;
        }, 
    });
}

export const useAddMovieToLibrary = () => {
    return useMutation({
        mutationFn: async (data: { movie_id: number; status: string; rating?: number | null }): Promise<EntryItem> => {
            const response = await apiClient.post(
                `${BASE_URL}${MOVIE_BASE}/${data.movie_id}/library`,
                { status: data.status, rating: data.rating ?? null },
            );
            return response.data;
        },
    });
}