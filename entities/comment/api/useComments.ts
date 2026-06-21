import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { Comment } from '@/shared/api/types/initial_schema';

export function useComments(postId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.comments, postId],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: Comment[] }>(
                endpoints.postComments(postId)
            );
            return data.data;
        },
        enabled: !!postId,
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            postId,
            content,
            parentId,
        }: {
            postId: number;
            content: string;
            parentId?: number;
        }) => {
            const { data } = await httpClient.post<{ success: boolean; data: Comment }>(
                endpoints.postComments(postId),
                { content, parent_id: parentId }
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.comments, variables.postId] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.post, variables.postId] });
        },
    });
}

export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content }: { id: number; content: string }) => {
            const { data } = await httpClient.put<{ success: boolean; data: Comment }>(
                endpoints.comment(id),
                { content }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.comments] });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await httpClient.delete<{ success: boolean }>(endpoints.comment(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.comments] });
        },
    });
}
