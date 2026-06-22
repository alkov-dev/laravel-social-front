import { Center, Text, Stack, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Произошла ошибка',
    description = 'Не удалось загрузить данные',
    onRetry,
}: ErrorStateProps) {
    return (
        <Center py="xl">
            <Stack align="center" gap="md">
                <IconAlertCircle size={64} stroke={1.5} color="var(--mantine-color-red-5)" />
                <Text size="lg" fw={500} ta="center">
                    {title}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                    {description}
                </Text>
                {onRetry && (
                    <Button color="violet" variant="light" onClick={onRetry}>
                        Попробовать снова
                    </Button>
                )}
            </Stack>
        </Center>
    );
}