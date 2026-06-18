'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/entities/auth/model/store';
import { Loader, Center } from '@mantine/core';

interface AuthGuardProps {
    children: React.ReactNode;
}

// 📋 Список публичных маршрутов (доступны без авторизации)
const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthGuard({ children }: AuthGuardProps) {
    const { token, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // 🔍 Проверяем, является ли текущий путь публичным
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        const checkAuth = () => {
            // 🔹 Если НЕ авторизован
            if (!token || !isAuthenticated) {
                // Если это публичный маршрут — пропускаем
                if (isPublicRoute) {
                    setIsChecking(false);
                    return;
                }

                // Иначе редиректим на логин
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            // 🔹 Если авторизован и пытается зайти на login/register — редиректим на главную
            if (isPublicRoute) {
                router.push('/');
                return;
            }

            // 🔹 Авторизован и на защищённой странице — всё ок
            setIsChecking(false);
        };

        checkAuth();
    }, [token, isAuthenticated, router, pathname, isPublicRoute]);

    // ⏳ Показываем загрузку во время проверки
    if (isChecking) {
        return (
            <Center style={{ height: '100vh' }}>
                <Loader size="lg" />
            </Center>
        );
    }

    return <>{children}</>;
}