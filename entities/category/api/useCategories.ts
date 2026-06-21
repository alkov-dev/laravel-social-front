import { useQuery } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { Category } from '@/shared/api/types/initial_schema';

export function useCategories() {
    return useQuery({
        queryKey: [QUERY_KEYS.categories],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: Category[] }>(
                endpoints.categories
            );
            return data.data;
        },
    });
}

export function useCategory(id: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.categories, id],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: Category }>(
                endpoints.category(id)
            );
            return data.data;
        },
        enabled: !!id,
    });
}