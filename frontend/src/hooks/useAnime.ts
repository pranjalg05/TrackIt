import apiClient from "@/clients/apiClient";
import { BASE_URL } from "@/libs/config";
import type { AnimeDetailItem, AnimeSearchItem } from "@/models/anime";
import type { EntryItem } from "@/models/entries";
import { useMutation, useQuery } from "@tanstack/react-query";


const ANIME_BASE = "/anime";

export const useSearchAnimeByTitle = (title: string, page: number = 1) => {
    return useQuery({
        queryKey: ["searchAnimeByTitle", title, page],
        queryFn: async (): Promise<AnimeSearchItem[]> => {
            const response = await apiClient.get(`${BASE_URL}${ANIME_BASE}/search`, {
                params: { title, page },
            });
            return response.data;
        },
        enabled: Boolean(title.trim()), 
    });
}

export const  useGetAnimeById = (id: number) => {
    return useQuery({
        queryKey: ["animeById", id],
        queryFn: async (): Promise<AnimeDetailItem> => {
            const response = await apiClient.get(`${BASE_URL}${ANIME_BASE}/${id}`)
            return response.data;
        }
    })
}

export const useAddAnimeToLibrary = () => {
    return useMutation({
        mutationFn: async (data: { anime_id: number; status: string }): Promise<EntryItem> => {
            const response = await apiClient.post(
                `${BASE_URL}${ANIME_BASE}/${data.anime_id}/library`,
                { status: data.status },
            );
            return response.data;
        },
    });
}