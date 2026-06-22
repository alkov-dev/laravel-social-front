import { Center, Text, Stack } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function EmptyState({
    title = 'Ничего не найдено',
    description = 'Попробуйте изменить параметры поиска',
    icon,
}: EmptyStateProps) {
    return (
        <Center py="xl">
            <Stack align="center" gap="md">
                {icon || <IconInbox size={64} stroke={1.5} color="var(--mantine-color-violet-5)" />}
                <Text size="lg" fw={500} ta="center">
                    {title}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                    {description}
                </Text>
            </Stack>
        </Center>
    );
}