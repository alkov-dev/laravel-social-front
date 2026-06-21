'use client';

import {
    TextInput,
    Textarea,
    Select,
    FileInput,
    Button,
    Stack,
    Paper,
    Title,
    Group,
    Image,
    ActionIcon,
    Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhoto, IconX, IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/entities/post/api/usePost';
import { useCategories } from '@/entities/category/api/useCategories';
import { uploadImage } from '@/shared/api/upload';
import { useState } from 'react';
import classes from './CreatePostForm.module.scss';

interface ImageItem {
    file: File;
    preview: string;
    alt: string;
}

export function CreatePostForm() {
    const router = useRouter();
    const { data: categories } = useCategories();
    const createPost = useCreatePost();
    const [images, setImages] = useState<ImageItem[]>([]);
    const [uploading, setUploading] = useState(false);

    const form = useForm({
        initialValues: {
            title: '',
            content: '',
            category_id: '',
        },
        validate: {
            title: (value) => (value.length < 3 ? 'Минимум 3 символа' : null),
            category_id: (value) => (!value ? 'Выберите категорию' : null),
        },
    });

    const handleImageUpload = async (files: File[]) => {
        setUploading(true);
        try {
            const newImages: ImageItem[] = [];
            for (const file of files) {
                const preview = URL.createObjectURL(file);
                newImages.push({ file, preview, alt: '' });
            }
            setImages((prev) => [...prev, ...newImages]);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('category_id', values.category_id);

            for (const image of images) {
                formData.append('images[]', image.file);
                formData.append('alt_texts[]', image.alt);
            }

            await createPost.mutateAsync(formData);
            notifications.show({
                title: 'Успех',
                message: 'Пост успешно создан',
                color: 'cyan',
            });
            router.push('/');
        } catch {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось создать пост',
                color: 'red',
            });
        }
    };

    return (
        <Paper p="xl" radius="md" withBorder>
            <Title order={2} mb="lg">
                Создать пост
            </Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label="Заголовок"
                        placeholder="Введите заголовок поста"
                        required
                        {...form.getInputProps('title')}
                    />

                    <Select
                        label="Категория"
                        placeholder="Выберите категорию"
                        data={categories?.map((c) => ({
                            value: String(c.id),
                            label: `${c.icon} ${c.name}`,
                        }))}
                        required
                        {...form.getInputProps('category_id')}
                    />

                    <Textarea
                        label="Содержание"
                        placeholder="О чём ваш пост?"
                        minRows={6}
                        {...form.getInputProps('content')}
                    />

                    <div>
                        <Text size="sm" fw={500} mb="xs">
                            Изображения
                        </Text>
                        <FileInput
                            placeholder="Выберите изображения"
                            accept="image/*"
                            multiple
                            leftSection={<IconPhoto size={16} />}
                            onChange={handleImageUpload}
                            loading={uploading}
                        />
                    </div>

                    {images.length > 0 && (
                        <div className={classes.imagesGrid}>
                            {images.map((image, index) => (
                                <div key={index} className={classes.imageItem}>
                                    <Image
                                        src={image.preview}
                                        alt={image.alt}
                                        height={120}
                                        fit="cover"
                                        radius="md"
                                    />
                                    <ActionIcon
                                        color="red"
                                        variant="filled"
                                        size="sm"
                                        className={classes.removeButton}
                                        onClick={() => removeImage(index)}
                                    >
                                        <IconX size={14} />
                                    </ActionIcon>
                                </div>
                            ))}
                        </div>
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button
                            type="submit"
                            color="cyan"
                            loading={createPost.isPending}
                            leftSection={<IconSend size={16} />}
                        >
                            Опубликовать
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}