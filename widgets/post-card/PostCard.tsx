'use client';

import {
    Card,
    Image,
    Text,
    Group,
    ActionIcon,
    Badge,
    Stack,
    Modal,
    Menu,
    Button,
} from '@mantine/core';
import { IconDots, IconEdit, IconMessageCircle, IconShare, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LikeButton } from '@/features/post/like/LikeButton';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { formatDistanceToNow, formatNumber, getFullImageUrl } from '@/shared/lib/format';
import type { Post } from '@/shared/api/types/initial_schema';
import classes from './PostCard.module.scss';
import { useDeletePost } from '@/entities/post/api/usePost';
import { useProfile } from '@/entities/user/api/useProfile';
import { notifications } from '@mantine/notifications';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter();
    const [fullImage, setFullImage] = useState<string | null>(null);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    const deletePost = useDeletePost();

    const { data: currentUser } = useProfile();

    // Проверяем, является ли текущий пользователь автором
    const isOwner = currentUser?.id === post.user?.id;

    const handleDelete = async () => {
        try {
            await deletePost.mutateAsync(post.id);
            notifications.show({
                title: 'Успех',
                message: 'Пост удалён',
                color: 'violet',
            });
            setDeleteModalOpened(false);
        } catch (error: any) {
            notifications.show({
                title: 'Ошибка',
                message: error.response?.data?.message || 'Не удалось удалить пост',
                color: 'red',
            });
        }
    };

    return (
        <>
            <Card className={classes.card} shadow="sm" padding="lg">
                {post.preview_image && (
                    <Image
                        src={post.preview_image.preview_url}
                        alt={post.preview_image.alt_text || post.title}
                        height={300}
                        fit="cover"
                        radius="md"
                        className={classes.image}
                        onClick={() => setFullImage(post.preview_image!.full_url)}
                    />
                )}

                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between">
                        <Group gap="sm" onClick={() => router.push(`/users/${post.user?.id}`)} style={{ cursor: 'pointer' }}>
                            <AppAvatar src={post.user?.avatar} name={post.user?.name} size="md" />
                            <div>
                                <Text size="sm" fw={500}>
                                    {post.user?.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {formatDistanceToNow(post.published_at || post.created_at)}
                                </Text>
                            </div>
                        </Group>

                        <Group gap="xl">
                            {post.category && (
                                <Badge
                                    color="violet"
                                    variant="light"
                                    leftSection={post.category.icon}
                                >
                                    {post.category.name}
                                </Badge>
                            )}

                            {isOwner && (
                                <Menu shadow="md" width={200} position="bottom-end">
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="gray" aria-label="Меню">
                                            <IconDots size={16} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={<IconEdit size={14} />}
                                            onClick={() => router.push(`/posts/${post.id}/edit`)}
                                        >
                                            Редактировать
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<IconTrash size={14} />}
                                            color="red"
                                            onClick={() => setDeleteModalOpened(true)}
                                        >
                                            Удалить
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </Group>
                    </Group>
                </Card.Section>

                <Stack gap="xs" mt="md" onClick={() => router.push(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>
                    <Text size="lg" fw={600}>
                        {post.title}
                    </Text>

                    {post.content && (
                        <Text size="sm" c="dimmed" lineClamp={3}>
                            {post.content}
                        </Text>
                    )}
                </Stack>

                <Card.Section withBorder inheritPadding py="xs" mt="md">
                    <Group justify="space-between">
                        <Group gap="md">
                            <LikeButton
                                postId={post.id}
                                isLiked={post.is_liked}
                                likesCount={post.likes_count}
                            />

                            <Group gap="xs">
                                <ActionIcon variant="light" color="violet" aria-label="Comment">
                                    <IconMessageCircle size={18} />
                                </ActionIcon>
                                <Text size="sm">{formatNumber(post.comments_count)}</Text>
                            </Group>

                            <ActionIcon variant="light" color="violet" aria-label="Share">
                                <IconShare size={18} />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card.Section>
            </Card>

            {/* Модальное окно подтверждения удаления */}
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Удалить пост?"
                centered
            >
                <Text size="sm" mb="lg">
                    Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.
                </Text>
                <Group justify="flex-end" gap="sm">
                    <Button
                        variant="default"
                        onClick={() => setDeleteModalOpened(false)}
                        disabled={deletePost.isPending}
                    >
                        Отмена
                    </Button>
                    <Button
                        color="red"
                        onClick={handleDelete}
                        loading={deletePost.isPending}
                        leftSection={<IconTrash size={14} />}
                    >
                        Удалить
                    </Button>
                </Group>
            </Modal>

            <Modal
                opened={!!fullImage}
                onClose={() => setFullImage(null)}
                size="xl"
                centered
                withCloseButton={false}
            >
                <Image src={fullImage} alt="" fit="contain" />
            </Modal>
        </>
    );
}