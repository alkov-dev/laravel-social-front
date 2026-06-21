import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { Post, PaginatedResponse } from '@/shared/api/types/initial_schema';

interface PostsParams {
    category_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export function usePosts(params?: PostsParams) {
    return useQuery({
        queryKey: [QUERY_KEYS.posts, params],
        queryFn: async () => {
            const { data } = await httpClient.get<PaginatedResponse<Post>>(
                endpoints.posts,
                { params }
            );
            return data;
        },
    });
}

export function usePost(id: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.post, id],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: Post }>(
                endpoints.post(id)
            );
            return data.data;
        },
        enabled: !!id,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await httpClient.post<{ success: boolean; data: Post }>(
                endpoints.posts,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
            const { data } = await httpClient.put<{ success: boolean; data: Post }>(
                endpoints.post(id),
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.post, variables.id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await httpClient.delete<{ success: boolean }>(endpoints.post(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}

export function useToggleLike(postId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await httpClient.post<{
                success: boolean;
                is_liked: boolean;
                likes_count: number;
            }>(endpoints.postLike(postId));
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEYS.post, postId], (old: Post | undefined) => {
                if (!old) return old;
                return { ...old, is_liked: data.is_liked, likes_count: data.likes_count };
            });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}