import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingProps {
    text?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Loading({ text = 'Загрузка...', size = 'xl' }: LoadingProps) {
    return (
        <Center py="xl">
            <Stack align="center" gap="md">
                <Loader size={size} color="cyan" type="dots" />
                <Text size="sm" c="dimmed">
                    {text}
                </Text>
            </Stack>
        </Center>
    );
}
