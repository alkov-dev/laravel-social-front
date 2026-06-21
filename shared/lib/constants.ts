export const APP_NAME = 'Social Network';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    profile: '/profile',
    profileById: (id: number) => `/users/${id}`,
    post: (id: number) => `/posts/${id}`,
    createPost: '/posts/create',
    settings: '/settings',
} as const;

export const QUERY_KEYS = {
    posts: 'posts',
    post: 'post',
    categories: 'categories',
    comments: 'comments',
    profile: 'profile',
    user: 'user',
} as const;
