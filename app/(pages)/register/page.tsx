'use client';

import { Title, Paper, Text } from '@mantine/core';
import Link from 'next/link';
import { Header } from '@/widgets/header';
import { RegisterForm } from '@/features/auth/register';
import classes from './register-page.module.scss';

export default function RegisterPage() {
    return (
        <>
            <Header />
            <div className={classes.container}>
                <Paper className={classes.card} shadow="sm">
                    <Title order={2} className={classes.title}>
                        Регистрация
                    </Title>

                    <RegisterForm />

                    <Text className={classes.footer}>
                        Уже есть аккаунт?{' '}
                        <Link href="/login" className={classes.link}>
                            Войти
                        </Link>
                    </Text>
                </Paper>
            </div>
        </>
    );
}