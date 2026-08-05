import { BASE_URL } from './../libs/config';
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../clients/apiClient";
import type { EntryItem } from "@/models/entries";
import type { GameDetailItem, GameSearchItem } from '@/models/games';

const GAME_BASE = "/game";

export const useSearchGameByTitle = (title: string) => {
    return useQuery({
        queryKey: ["searchGameByTitle", title],
        queryFn: async (): Promise<GameSearchItem[]> => {
            const response = await apiClient.get(`${BASE_URL}${GAME_BASE}/search`, {
                params: { title },
            });
            return response.data;
        },
        enabled: Boolean(title.trim()), 
    });
}

export const useGameById = (id: number) => {
    return useQuery({
        queryKey: ["gameById", id],
        queryFn: async (): Promise<GameDetailItem> => {
            const response =  await apiClient.get(`${BASE_URL}${GAME_BASE}/${id}`);
            return  response.data;
        }
    });
}

export const useAddGameToLibrary = () => {
    return useMutation({
        mutationFn: async (data: { game_id: number; status: string;  }): Promise<EntryItem> => {
            const response = await apiClient.post(
                `${BASE_URL}${GAME_BASE}/${data.game_id}/library`,
                { status: data.status },
            );
            return response.data;
        },
    });
}
