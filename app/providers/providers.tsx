'use client';


import '../globals.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { mantineTheme } from '@/shared/config/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './auth-guard/auth-guard';
import { useState } from 'react';
import { Header } from '@/widgets/header/Header';

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 минут
                        retry: 1,
                    },
                },
            })
    );


    return (
        <MantineProvider theme={mantineTheme} defaultColorScheme="light">
            <QueryClientProvider client={queryClient}>
                <Notifications position="top-right" />
                <AuthGuard>
                    <Header />
                    {children}
                </AuthGuard >
            </QueryClientProvider>
        </MantineProvider>
    );
}