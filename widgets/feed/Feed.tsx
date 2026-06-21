'use client';

import { Container, Stack, Pagination, Title } from '@mantine/core';
import { useState } from 'react';
import { usePosts } from '@/entities/post/api/usePost';
import { PostCard } from '@/widgets/post-card/PostCard';
import { CategoryFilter } from '@/features/post/category-filter/CategoryFilter';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';

export function Feed() {
    const [page, setPage] = useState(1);
    const [categoryId, setCategoryId] = useState<number | undefined>();

    const { data, isLoading, error, refetch } = usePosts({
        page,
        per_page: 10,
        category_id: categoryId,
    });

    if (isLoading) return <Loading text="Загрузка постов..." />;

    if (error) {
        return <ErrorState onRetry={refetch} />;
    }

    return (
        <Container size="md" py="xl">
            <Title order={1} mb="xl" ta="center">
                Лента постов
            </Title>

            <CategoryFilter value={categoryId} onChange={setCategoryId} mb="xl" />

            {!data?.data || data.data.length === 0 ? (
                <EmptyState
                    title="Постов пока нет"
                    description="Будьте первым, кто опубликует пост!"
                />
            ) : (
                <Stack gap="lg">
                    {data.data.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </Stack>
            )}

            {data && data.meta.last_page > 1 && (
                <Pagination
                    value={page}
                    onChange={setPage}
                    total={data.meta.last_page}
                    mt="xl"
                    color="cyan"
                    withEdges
                />
            )}
        </Container>
    );
}