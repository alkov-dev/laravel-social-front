'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { validators } from '@/shared/lib/validators';
import classes from './register-form.module.scss';
import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '@/shared/api/requests/auth-requests';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useAuthStore } from '@/entities/auth/model/store';


export function RegisterForm() {
    const { setToken } = useAuthStore();

    const registerMutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: (data) => {
            setToken(data.token);

            showNotification({
                title: 'Регистрация прошла успешно',
                message: 'Добро пожаловать!',
                icon: <IconX size={20} />,
                color: 'green',
                autoClose: 4000,
            });
            router.push('/')
        },
        onError: (error) => {
            showNotification({
                title: 'Ошибка регистрации',
                message: 'Попробуйте еще раз',
                icon: <IconX size={20} />,
                color: 'red',
                autoClose: 4000,
            });
            console.error(error.message)
        }
    })

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            name: validators.name,
            email: validators.email,
            password: validators.password,
            confirmPassword: validators.confirmPassword,
        },
    });

    const handleSubmit = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
        setLoading(true);
        await registerMutation.mutateAsync({
            data: {
                name: values.name,
                email: values.email,
                password: values.password,
                password_confirmation: values.confirmPassword
            },
            url: '/register'
        });
        setLoading(false);
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
            <TextInput
                label="Имя"
                placeholder="Иван Иванов"
                required
                {...form.getInputProps('name')}
            />

            <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...form.getInputProps('email')}
            />

            <PasswordInput
                label="Пароль"
                placeholder="Минимум 6 символов"
                required
                {...form.getInputProps('password')}
            />

            <PasswordInput
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
                required
                {...form.getInputProps('confirmPassword')}
            />

            <Button type="submit" className={classes.submitButton} loading={loading}>
                Зарегистрироваться
            </Button>
        </form>


    );
}




