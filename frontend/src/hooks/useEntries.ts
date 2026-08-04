import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../libs/config";
import apiClient from "../clients/apiClient";
import type { EntryItem } from "@/models/entries";

const ENTRY_BASE = "/entry";

export interface UserEntriesParams {
    sort?: string;
    order?: string;
    minRating?: number;
    maxRating?: number;
}

export const useUserEntries = (params: UserEntriesParams = {}) => {
    return useQuery({
        queryKey: ["userEntries", params],
        queryFn: async (): Promise<EntryItem[]> => {
            const queryParams: Record<string, string> = {};
            if (params.sort) queryParams.sort = params.sort;
            if (params.order) queryParams.order = params.order;
            if (params.minRating != null && params.minRating > 0) queryParams.min_rating = String(params.minRating);
            if (params.maxRating != null && params.maxRating < 10) queryParams.max_rating = String(params.maxRating);
            const response = await apiClient.get(`${BASE_URL}${ENTRY_BASE}`, { params: queryParams });
            return response.data;
        },
    });
}

export const useEntryByExternal = (source: string, externalId: string) => {
    return useQuery({
        queryKey: ["entryByExternal", source, externalId],
        queryFn: async (): Promise<EntryItem | null> => {
            const response = await apiClient.get(`${BASE_URL}${ENTRY_BASE}/check`, {
                params: { source, external_id: externalId },
            });
            return response.data;
        },
        enabled: Boolean(source && externalId),
    });
}

export const useUpdateEntryStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { entry_id: number; status: string }): Promise<EntryItem> => {
            const response = await apiClient.patch(
                `${BASE_URL}${ENTRY_BASE}/${data.entry_id}/status`,
                { status: data.status },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userEntries"] });
        },
    });
}

export const useUpdateEntryRating = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { entry_id: number; rating: number }): Promise<EntryItem> => {
            const response = await apiClient.patch(
                `${BASE_URL}${ENTRY_BASE}/${data.entry_id}/rating`,
                { rating: data.rating },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userEntries"] });
        },
    });
}

export const useUpdateEntryNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { entry_id: number; note: string | null }): Promise<EntryItem> => {
            const response = await apiClient.patch(
                `${BASE_URL}${ENTRY_BASE}/${data.entry_id}/note`,
                { note: data.note },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userEntries"] });
        },
    });
}