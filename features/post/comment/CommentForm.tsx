'use client';

import { Textarea, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSend } from '@tabler/icons-react';
import { useCreateComment } from '@/entities/comment/api/useComments';

interface CommentFormProps {
    postId: number;
    parentId?: number;
    onSuccess?: () => void;
    placeholder?: string;
}

export function CommentForm({ postId, parentId, onSuccess, placeholder }: CommentFormProps) {
    const createComment = useCreateComment();

    const form = useForm({
        initialValues: { content: '' },
        validate: {
            content: (value) => (value.trim().length < 1 ? 'Введите комментарий' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await createComment.mutateAsync({
                postId,
                content: values.content,
                parentId,
            });
            form.reset();
            onSuccess?.();
        } catch {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось добавить комментарий',
                color: 'red',
            });
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Textarea
                placeholder={placeholder || 'Напишите комментарий...'}
                minRows={2}
                {...form.getInputProps('content')}
            />
            <Group justify="flex-end" mt="sm">
                <Button
                    type="submit"
                    color="cyan"
                    size="sm"
                    loading={createComment.isPending}
                    leftSection={<IconSend size={14} />}
                >
                    Отправить
                </Button>
            </Group>
        </form>
    );
}