export const validators = {
    email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Неверный email'),
    password: (value: string) =>
        value.length >= 6 ? null : 'Пароль должен содержать минимум 6 символов',
    name: (value: string) =>
        value.length >= 2 ? null : 'Имя должно содержать минимум 2 символа',
    confirmPassword: (value: string, values: { password: string }) =>
        value === values.password ? null : 'Пароли не совпадают',
};