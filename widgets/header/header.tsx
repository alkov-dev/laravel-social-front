'use client';

import {
    Group,
    Title,
    Button,
    Menu,
} from '@mantine/core';
import { IconLogout, IconUser, IconSettings, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './Header.module.scss';
import { useAuthStore } from '@/entities/auth/model/store';
import { useMutation } from '@tanstack/react-query';
import { logoutRequest } from '@/shared/api/requests/user-request';
import Link from 'next/link';

export function Header() {
    const router = useRouter();

    const { token, removeToken } = useAuthStore()

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            removeToken(); // Очистка токена при успешном выходе из Zustand и localStorage
            router.push('/login')
        },
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    return (
        <header className={classes.header}>
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Title order={3} c="violet">
                        SocialBook
                    </Title>
                </Group>

                <Group>
                    {token ? (
                        <>
                            <Button
                                color="violet"
                                leftSection={<IconPlus size={16} />}
                                component={Link}
                                href="/create"
                            >
                                Создать пост
                            </Button>
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Button variant="light" color="violet">
                                        <IconUser size={16} />
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        leftSection={<IconUser size={14} />}
                                        onClick={() => router.push('/profile')}
                                    >
                                        Профиль
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconSettings size={14} />}
                                        onClick={() => router.push('/settings')}
                                    >
                                        Настройки
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        leftSection={<IconLogout size={14} />}
                                        color="red"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </>

                    ) : (
                        <>
                            <Button variant="light" color="violet" onClick={() => router.push('/login')}>
                                Войти
                            </Button>
                            <Button color="violet" onClick={() => router.push('/register')}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
        </header>
    );
}


