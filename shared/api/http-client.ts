import axios from 'axios';
import { useAuthStore } from '@/entities/auth/model/store';

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

const apiBaseUrl = 'http://localhost:8000/api';

const httpClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: false,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': ContentType.Json,
        'Accept': ContentType.Json,
    }
});

httpClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Токен недействителен — очищаем
            useAuthStore.getState().removeToken();
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default httpClient;