'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { theme } from '@/shared/config/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './auth-guard/auth-guard';

const queryClient = new QueryClient();

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <QueryClientProvider client={queryClient}>
                <Notifications position="top-right" />
                <AuthGuard>
                    {children}
                </AuthGuard >
            </QueryClientProvider>
        </MantineProvider>
    );
}