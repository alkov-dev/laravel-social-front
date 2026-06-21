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
} from '@mantine/core';
import { IconMessageCircle, IconShare } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LikeButton } from '@/features/post/like/LikeButton';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { formatDistanceToNow, formatNumber } from '@/shared/lib/format';
import type { Post } from '@/shared/api/types/initial_schema';
import classes from './PostCard.module.scss';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter();
    const [fullImage, setFullImage] = useState<string | null>(null);

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
                        <Group gap="sm" onClick={() => router.push(`/users/${post.user_id}`)} style={{ cursor: 'pointer' }}>
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

                        {post.category && (
                            <Badge
                                color="cyan"
                                variant="light"
                                leftSection={post.category.icon}
                            >
                                {post.category.name}
                            </Badge>
                        )}
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
                                <ActionIcon variant="light" color="cyan" aria-label="Comment">
                                    <IconMessageCircle size={18} />
                                </ActionIcon>
                                <Text size="sm">{formatNumber(post.comments_count)}</Text>
                            </Group>

                            <ActionIcon variant="light" color="cyan" aria-label="Share">
                                <IconShare size={18} />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card.Section>
            </Card>

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