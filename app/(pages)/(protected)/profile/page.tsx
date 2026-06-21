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
    Button,
    TextInput,
    Textarea,
    FileInput,
    Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCamera, IconGavel } from '@tabler/icons-react';
import { useProfile, useUpdateProfile } from '@/entities/user/api/useProfile';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { formatDate } from '@/shared/lib/format';
import classes from './page.module.scss';

export default function ProfilePage() {
    const { data: user, isLoading, error, refetch } = useProfile();
    const updateProfile = useUpdateProfile();

    const form = useForm({
        initialValues: {
            name: user?.name || '',
            bio: user?.bio || '',
            phone: user?.phone || '',
            city: user?.city || '',
            birth_date: user?.birth_date || '',
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Минимум 2 символа' : null),
        },
    });

    // Обновляем форму при загрузке данных
    if (user && !form.values.name) {
        form.setValues({
            name: user.name,
            bio: user.bio || '',
            phone: user.phone || '',
            city: user.city || '',
            birth_date: user.birth_date || '',
        });
    }

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('bio', values.bio);
            formData.append('phone', values.phone);
            formData.append('city', values.city);
            if (values.birth_date) formData.append('birth_date', values.birth_date);

            await updateProfile.mutateAsync(formData);
            notifications.show({
                title: 'Успех',
                message: 'Профиль обновлён',
                color: 'cyan',
            });
        } catch {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось обновить профиль',
                color: 'red',
            });
        }
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorState onRetry={refetch} />;
    if (!user) return <ErrorState title="Профиль не найден" />;

    return (
        <Container size="md" py="xl">
            <Paper p="xl" radius="md" withBorder>
                <Stack gap="xl">
                    {/* Аватар и основная информация */}
                    <Group align="flex-start">
                        <Avatar
                            src={user.avatar}
                            size={120}
                            radius="xl"
                            color="cyan"
                            className={classes.avatar}
                        >
                            {!user.avatar && <IconCamera size={40} />}
                        </Avatar>

                        <Stack gap="xs" style={{ flex: 1 }}>
                            <Title order={2}>{user.name}</Title>
                            <Text c="dimmed">{user.email}</Text>
                            {user.city && <Badge color="cyan" variant="light">{user.city}</Badge>}
                            <Text size="sm" c="dimmed">
                                Регистрация: {formatDate(user.created_at)}
                            </Text>
                        </Stack>
                    </Group>

                    <Divider />

                    {/* Форма редактирования */}
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Имя"
                                placeholder="Ваше имя"
                                required
                                {...form.getInputProps('name')}
                            />

                            <Textarea
                                label="О себе"
                                placeholder="Расскажите о себе"
                                minRows={3}
                                {...form.getInputProps('bio')}
                            />

                            <TextInput
                                label="Телефон"
                                placeholder="+7 (999) 123-45-67"
                                {...form.getInputProps('phone')}
                            />

                            <TextInput
                                label="Город"
                                placeholder="Ваш город"
                                {...form.getInputProps('city')}
                            />

                            <TextInput
                                label="Дата рождения"
                                type="date"
                                {...form.getInputProps('birth_date')}
                            />

                            <FileInput
                                label="Аватар"
                                placeholder="Выберите изображение"
                                accept="image/*"
                                leftSection={<IconCamera size={16} />}
                            />

                            <Button
                                type="submit"
                                color="cyan"
                                loading={updateProfile.isPending}
                                leftSection={<IconGavel size={16} />}
                            >
                                Сохранить изменения
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Container>
    );
}