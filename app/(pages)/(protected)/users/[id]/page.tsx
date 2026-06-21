'use client';

import {
    Container,
    Paper,
    Stack,
    Text,
    Group,
    Avatar,
    Title,
    Badge,
} from '@mantine/core';
import { useParams } from 'next/navigation';
import { useUser } from '@/entities/user/api/useProfile';
import { usePosts } from '@/entities/post/api/usePost';
import { PostCard } from '@/widgets/post-card/PostCard';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { formatDate } from '@/shared/lib/format';
import classes from './page.module.scss';

export default function UserProfilePage() {
    const params = useParams();
    const userId = Number(params.id);

    const { data: user, isLoading, error, refetch } = useUser(userId);
    const { data: postsData } = usePosts({ per_page: 100 });

    if (isLoading) return <Loading />;
    if (error) return <ErrorState onRetry={refetch} />;
    if (!user) return <ErrorState title="Пользователь не найден" />;

    const userPosts = postsData?.data.filter((p) => p.user_id === userId) || [];

    return (
        <Container size="md" py="xl">
            <Paper p="xl" radius="md" withBorder mb="xl">
                <Group align="flex-start">
                    <Avatar
                        src={user.avatar}
                        size={120}
                        radius="xl"
                        color="cyan"
                        className={classes.avatar}
                    />

                    <Stack gap="xs" style={{ flex: 1 }}>
                        <Title order={2}>{user.name}</Title>
                        <Text c="dimmed">{user.email}</Text>

                        {user.bio && (
                            <Text size="sm" mt="sm">
                                {user.bio}
                            </Text>
                        )}

                        <Group gap="sm" mt="sm">
                            {user.city && <Badge color="cyan" variant="light">{user.city}</Badge>}
                            {user.birth_date && (
                                <Badge color="cyan" variant="light">
                                    {formatDate(user.birth_date)}
                                </Badge>
                            )}
                        </Group>

                        <Text size="xs" c="dimmed" mt="sm">
                            Регистрация: {formatDate(user.created_at)}
                        </Text>
                    </Stack>
                </Group>
            </Paper>

            <Title order={3} mb="md">
                Посты пользователя ({userPosts.length})
            </Title>

            <Stack gap="lg">
                {userPosts.length > 0 ? (
                    userPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                    <Paper p="xl" radius="md" withBorder ta="center">
                        <Text c="dimmed">У пользователя пока нет постов</Text>
                    </Paper>
                )}
            </Stack>
        </Container>
    );
}