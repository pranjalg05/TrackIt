import apiClient from "@/clients/apiClient";
import { BASE_URL } from "@/libs/config";
import type { MangaDetailItem, MangaSearchItem } from "@/models/manga";
import type { EntryItem } from "@/models/entries";
import { useMutation, useQuery } from "@tanstack/react-query";

const MANGA_BASE = "/manga";

export const useSearchMangaByTitle = (title: string, page: number = 1) => {
    return useQuery({
        queryKey: ["searchMangaByTitle", title, page],
        queryFn: async (): Promise<MangaSearchItem[]> => {
            const response = await apiClient.get(`${BASE_URL}${MANGA_BASE}/search`, {
                params: { title, page },
            });
            return response.data;
        },
        enabled: Boolean(title.trim()),
    });
};

export const useGetMangaById = (id: number) => {
    return useQuery({
        queryKey: ["mangaById", id],
        queryFn: async (): Promise<MangaDetailItem> => {
            const response = await apiClient.get(`${BASE_URL}${MANGA_BASE}/${id}`);
            return response.data;
        },
    });
};

export const useAddMangaToLibrary = () => {
    return useMutation({
        mutationFn: async (data: { manga_id: number; status: string }): Promise<EntryItem> => {
            const response = await apiClient.post(
                `${BASE_URL}${MANGA_BASE}/${data.manga_id}/library`,
                { status: data.status },
            );
            return response.data;
        },
    });
};