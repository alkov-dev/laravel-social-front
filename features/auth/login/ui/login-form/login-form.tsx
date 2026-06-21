'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { validators } from '@/shared/lib/validators';
import classes from './login-form.module.scss';
import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/shared/api/requests/auth-requests';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useAuthStore } from '@/entities/auth/model/store';

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { setToken } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {

            setToken(data.token);

            showNotification({
                title: 'Вход успешен',
                message: 'Добро пожаловать!',
                icon: <IconX size={20} />,
                color: 'green',
                autoClose: 4000,
            });
            router.push('/')
        },
        onError: (error) => {
            showNotification({
                title: 'Ошибка входа',
                message: 'Неверный email или пароль',
                icon: <IconX size={20} />,
                color: 'red',
                autoClose: 4000,
            });
            console.error(error.message)
        }
    })

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: validators.email,
            password: validators.password,
        },
    });

    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            await loginMutation.mutateAsync({
                data: {
                    email: values.email,
                    password: values.password,
                },
                url: '/login',
            });
        } catch (error) {
            console.error('Ошибка входа:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                form.onSubmit(handleSubmit)(event);
            }}
            className={classes.form}
        >
            <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...form.getInputProps('email')}
            />

            <PasswordInput
                label="Пароль"
                placeholder="Введите пароль"
                required
                {...form.getInputProps('password')}
            />

            <Button type="submit" className={classes.submitButton} loading={loading}>
                Войти
            </Button>
        </form>
    );
}

