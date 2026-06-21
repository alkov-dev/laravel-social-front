'use client';

import {
    Group,
    Title,
    Button,
    Menu,
} from '@mantine/core';
import { IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './Header.module.scss';
import { useAuthStore } from '@/entities/auth/model/store';
import { useMutation } from '@tanstack/react-query';
import { logoutRequest } from '@/shared/api/requests/user-request';

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
                    <Title order={3} c="cyan">
                        Social Network
                    </Title>
                </Group>

                <Group>
                    {token ? (
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Button variant="light" color="cyan">
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
                    ) : (
                        <>
                            <Button variant="light" color="cyan" onClick={() => router.push('/login')}>
                                Войти
                            </Button>
                            <Button color="cyan" onClick={() => router.push('/register')}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
        </header>
    );
}



// 'use client';

// import { Button, Menu, Avatar } from '@mantine/core';
// import { IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
// import Link from 'next/link';
// import classes from './header.module.scss';
// import { useCurrentUser } from '@/shared/api/hooks/user-info';
// import { useMutation } from '@tanstack/react-query';
// import { logoutRequest } from '@/shared/api/requests/user-request';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/entities/auth/model/store';


// export function Header() {
//     const router = useRouter();
//     // const { data: user, isLoading, error } = useCurrentUser()
//     const { token, removeToken } = useAuthStore()

//     const logoutMutation = useMutation({
//         mutationFn: logoutRequest,
//         onSuccess: () => {
//             removeToken(); // Очистка токена при успешном выходе из Zustand и localStorage
//             router.push('/login')
//         },
//     })

//     const handleLogout = () => {
//         logoutMutation.mutate()
//     }

//     return (
//         <header className={classes.header}>
//             <Link href="/" className={classes.logo}>
//                 My App
//             </Link>

//             {token ? (
//                 <Menu position="bottom-end" shadow="md">
//                     <Menu.Target>
//                         <div style={{ cursor: 'pointer' }}>
//                             <Avatar name={'test'} color="initials" />
//                         </div>
//                     </Menu.Target>

//                     <Menu.Dropdown>
//                         <Menu.Item leftSection={<IconUser size={14} />}>
//                             Профиль
//                         </Menu.Item>
//                         <Menu.Item leftSection={<IconSettings size={14} />}>
//                             Настройки
//                         </Menu.Item>
//                         <Menu.Divider />
//                         <Menu.Item
//                             leftSection={<IconLogout size={14} />}
//                             color="red"
//                             onClick={handleLogout}
//                         >
//                             Выйти
//                         </Menu.Item>
//                     </Menu.Dropdown>
//                 </Menu>
//             ) : (
//                 <div className={classes.authButtons}>
//                     <Button component={Link} href="/login" variant="light">
//                         Войти
//                     </Button>
//                     <Button component={Link} href="/register">
//                         Регистрация
//                     </Button>
//                 </div>
//             )}
//         </header>
//     );
// }