'use client';

import { ActionIcon, Group, Text } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useToggleLike } from '@/entities/post/api/usePost';
import { formatNumber } from '@/shared/lib/format';
import classes from './LikeButton.module.scss';

interface LikeButtonProps {
    postId: number;
    isLiked: boolean;
    likesCount: number;
}

export function LikeButton({ postId, isLiked, likesCount }: LikeButtonProps) {
    const { mutate: toggleLike, isPending } = useToggleLike(postId);

    return (
        <Group gap="xs">
            <ActionIcon
                variant={isLiked ? 'filled' : 'light'}
                color="violet"
                onClick={() => toggleLike()}
                loading={isPending}
                aria-label="Like"
                className={classes.button}
            >
                {isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
            </ActionIcon>
            <Text size="sm" fw={500}>
                {formatNumber(likesCount)}
            </Text>
        </Group>
    );
}