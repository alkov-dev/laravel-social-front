'use client';

import {
    Container,
    Paper,
    Stack,
    Text,
    Group,
    Badge,
    Image,
    Title,
    Divider,
    Modal,
} from '@mantine/core';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePost } from '@/entities/post/api/usePost';
import { useComments } from '@/entities/comment/api/useComments';
import { useProfile } from '@/entities/user/api/useProfile';
import { CommentForm } from '@/features/post/comment/CommentForm';
import { CommentItem } from '@/features/post/comment/CommentItem';
import { LikeButton } from '@/features/post/like/LikeButton';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { formatDistanceToNow, formatDateTime } from '@/shared/lib/format';
import classes from './page.module.scss';

export default function PostPage() {
    const params = useParams();
    const postId = Number(params.id);
    const [fullImage, setFullImage] = useState<string | null>(null);

    const { data: post, isLoading, error, refetch } = usePost(postId);
    const { data: comments } = useComments(postId);
    const { data: currentUser } = useProfile();

    if (isLoading) return <Loading />;
    if (error) return <ErrorState onRetry={refetch} />;
    if (!post) return <ErrorState title="Пост не найден" />;

    return (
        <Container size="md" py="xl">
            <Paper p="xl" radius="md" withBorder>
                <Stack gap="md">
                    {/* Шапка поста */}
                    <Group justify="space-between">
                        <Group gap="sm">
                            <AppAvatar src={post.user?.avatar} name={post.user?.name} size="lg" />
                            <div>
                                <Text size="md" fw={600}>
                                    {post.user?.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {formatDistanceToNow(post.published_at || post.created_at)}
                                </Text>
                            </div>
                        </Group>

                        {post.category && (
                            <Badge color="violet" variant="light" leftSection={post.category.icon}>
                                {post.category.name}
                            </Badge>
                        )}
                    </Group>

                    {/* Заголовок */}
                    <Title order={2}>{post.title}</Title>

                    {/* Изображения */}
                    {post.images && post.images.length > 0 && (
                        <div className={classes.imagesGrid}>
                            {post.images.map((image) => (
                                <Image
                                    key={image.id}
                                    src={image.preview_url}
                                    alt={image.alt_text || ''}
                                    height={200}
                                    fit="cover"
                                    radius="md"
                                    className={classes.image}
                                    onClick={() => setFullImage(image.full_url)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Содержание */}
                    {post.content && (
                        <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                            {post.content}
                        </Text>
                    )}

                    <Divider />

                    {/* Действия */}
                    <Group justify="space-between">
                        <LikeButton
                            postId={post.id}
                            isLiked={post.is_liked}
                            likesCount={post.likes_count}
                        />
                        <Text size="sm" c="dimmed">
                            {formatDateTime(post.created_at)}
                        </Text>
                    </Group>
                </Stack>
            </Paper>

            {/* Комментарии */}
            <Paper p="xl" radius="md" withBorder mt="lg">
                <Title order={3} mb="md">
                    Комментарии ({post.comments_count})
                </Title>

                <CommentForm postId={postId} />

                <Stack gap="sm" mt="lg">
                    {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                currentUserId={currentUser?.id}
                            />
                        ))
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">
                            Пока нет комментариев. Будьте первым!
                        </Text>
                    )}
                </Stack>
            </Paper>

            {/* Модальное окно для полного изображения */}
            <Modal
                opened={!!fullImage}
                onClose={() => setFullImage(null)}
                size="xl"
                centered
                withCloseButton={false}
            >
                <Image src={fullImage} alt="" fit="contain" />
            </Modal>
        </Container>
    );
} 