'use client';

import {
    Container,
    Paper,
    Stack,
    Title,
    Text,
    Switch,
    Divider,
    Button,
    Group,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBell, IconShield, IconPalette } from '@tabler/icons-react';
import { useState } from 'react';

export default function SettingsPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <Container size="md" py="xl">
            <Title order={1} mb="xl">
                Настройки
            </Title>

            <Stack gap="lg">
                {/* Уведомления */}
                <Paper p="xl" radius="md" withBorder>
                    <Group mb="md">
                        <IconBell size={24} color="var(--mantine-color-cyan-5)" />
                        <Title order={3}>Уведомления</Title>
                    </Group>

                    <Stack gap="md">
                        <Group justify="space-between">
                            <div>
                                <Text fw={500}>Push-уведомления</Text>
                                <Text size="sm" c="dimmed">
                                    Получать уведомления о новых лайках и комментариях
                                </Text>
                            </div>
                            <Switch
                                color="cyan"
                                checked={notificationsEnabled}
                                onChange={(event) => setNotificationsEnabled(event.currentTarget.checked)}
                            />
                        </Group>

                        <Divider />

                        <Group justify="space-between">
                            <div>
                                <Text fw={500}>Email-уведомления</Text>
                                <Text size="sm" c="dimmed">
                                    Получать уведомления на почту
                                </Text>
                            </div>
                            <Switch
                                color="cyan"
                                checked={emailNotifications}
                                onChange={(event) => setEmailNotifications(event.currentTarget.checked)}
                            />
                        </Group>
                    </Stack>
                </Paper>

                {/* Внешний вид */}
                <Paper p="xl" radius="md" withBorder>
                    <Group mb="md">
                        <IconPalette size={24} color="var(--mantine-color-cyan-5)" />
                        <Title order={3}>Внешний вид</Title>
                    </Group>

                    <Group justify="space-between">
                        <div>
                            <Text fw={500}>Тёмная тема</Text>
                            <Text size="sm" c="dimmed">
                                Использовать тёмную тему оформления
                            </Text>
                        </div>
                        <Switch
                            color="cyan"
                            checked={darkMode}
                            onChange={(event) => setDarkMode(event.currentTarget.checked)}
                        />
                    </Group>
                </Paper>

                {/* Безопасность */}
                <Paper p="xl" radius="md" withBorder>
                    <Group mb="md">
                        <IconShield size={24} color="var(--mantine-color-cyan-5)" />
                        <Title order={3}>Безопасность</Title>
                    </Group>

                    <Stack gap="md">
                        <Button variant="light" color="cyan">
                            Изменить пароль
                        </Button>
                        <Button variant="light" color="cyan">
                            Двухфакторная аутентификация
                        </Button>
                    </Stack>
                </Paper>

                <Button
                    color="cyan"
                    onClick={() =>
                        notifications.show({
                            title: 'Успех',
                            message: 'Настройки сохранены',
                            color: 'cyan',
                        })
                    }
                >
                    Сохранить настройки
                </Button>
            </Stack>
        </Container>
    );
}