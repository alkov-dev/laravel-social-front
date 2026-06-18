'use client';

import { Title, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import { Header } from '@/widgets/header';
import { LoginForm } from '@/features/auth/login';
import classes from './login-page.module.scss';

export default function LoginPage() {
    return (
        <>
            <Header />
            <div className={classes.container}>
                <Paper className={classes.card} shadow="sm">
                    <Title order={2} className={classes.title}>
                        Вход в систему
                    </Title>

                    <LoginForm />

                    <Text className={classes.footer}>
                        Нет аккаунта?{' '}
                        <Link href="/register" className={classes.link}>
                            Зарегистрироваться
                        </Link>
                    </Text>
                </Paper>
            </div>
        </>
    );
}