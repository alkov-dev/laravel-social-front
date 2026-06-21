import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { User } from '@/shared/api/types/initial_schema';

export function useProfile() {
    return useQuery({
        queryKey: [QUERY_KEYS.profile],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: User }>(
                endpoints.profile
            );
            return data.data;
        },
    });
}

export function useUser(id: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.user, id],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: User }>(
                endpoints.user(id)
            );
            return data.data;
        },
        enabled: !!id,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await httpClient.put<{ success: boolean; data: User }>(
                endpoints.profile,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEYS.profile], data.data);
        },
    });
}
