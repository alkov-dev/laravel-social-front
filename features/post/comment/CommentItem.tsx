'use client';

import {
    Paper,
    Group,
    Text,
    Stack,
    ActionIcon,
    Collapse,
    Button,
} from '@mantine/core';
import { IconMessageCircle, IconTrash, IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { formatDistanceToNow } from '@/shared/lib/format';
import { CommentForm } from './CommentForm';
import { useDeleteComment } from '@/entities/comment/api/useComments';
import type { Comment } from '@/shared/api/types/initial_schema';

import classes from './CommentItem.module.scss';

interface CommentItemProps {
    comment: Comment;
    postId: number;
    currentUserId?: number;
    depth?: number;
}

export function CommentItem({ comment, postId, currentUserId, depth = 0 }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const deleteComment = useDeleteComment();

    const isOwner = currentUserId === comment.user?.id;

    const maxDepth = 2;
    const isNested = depth > 0;

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            className={`${classes.comment} ${isNested ? classes.nested : ''}`}
            style={{ marginLeft: depth * 24 }}
        >
            <Stack gap="xs">
                <Group justify="space-between">
                    <Group gap="sm">
                        <AppAvatar src={comment.user?.avatar} name={comment.user?.name} size="sm" />
                        <div>
                            <Text size="sm" fw={500}>
                                {comment.user?.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {formatDistanceToNow(comment.created_at)}
                            </Text>
                        </div>
                    </Group>

                    <Group gap="xs">
                        {!isOwner && (
                            <Button
                                variant="subtle"
                                size="compact-xs"
                                color="violet"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                leftSection={<IconMessageCircle size={14} />}
                            >
                                Ответить
                            </Button>
                        )}


                        {isOwner && (
                            <>
                                <ActionIcon variant="light" color="violet" size="sm">
                                    <IconEdit size={14} />
                                </ActionIcon>
                                <ActionIcon
                                    variant="light"
                                    color="red"
                                    size="sm"
                                    onClick={() => deleteComment.mutate(comment.id)}
                                >
                                    <IconTrash size={14} />
                                </ActionIcon>
                            </>
                        )}
                    </Group>
                </Group>

                <Text size="sm">{comment.content}</Text>


                <Collapse expanded={true} >
                    {showReplyForm && (
                        <CommentForm
                            postId={postId}
                            parentId={comment.id}
                            placeholder={`Ответ ${comment.user?.name}...`}
                            onSuccess={() => setShowReplyForm(false)}
                        />
                    )}
                </Collapse>

                {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
                    <Stack gap="xs" mt="sm">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                currentUserId={currentUserId}
                                depth={depth + 1}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}