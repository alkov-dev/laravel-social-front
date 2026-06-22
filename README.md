
```javascript
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
-------------------------------
1️⃣ Инициализация проекта
# Создаём Next.js проект
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir

cd frontend

# Устанавливаем зависимости
npm install @mantine/core @mantine/hooks @mantine/notifications @mantine/dates
npm install @tanstack/react-query axios
npm install dayjs
npm install -D @types/node @types/react @types/react-dom
npm install -D sass

# Mantine требует PostCSS
npm install postcss postcss-preset-mantine postcss-simple-vars

-------------------------------
2️⃣ Настройка Mantine с violet темой
src/shared/config/mantine.ts


import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
  primaryColor: 'grape',
  colors: {
    violet: [
      '#f3f0ff', // violet-0
      '#e5dbff', // violet-1
      '#d0bfff', // violet-2
      '#b197fc', // violet-3
      '#9775fa', // violet-4
      '#845ef7', // violet-5
      '#7950f2', // violet-6
      '#7048e8', // violet-7
      '#6741d9', // violet-8
      '#5f3dc4', // violet-9
    ],
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '700',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
  },
});

3️⃣ Настройка API клиента
-------------------------------
src/shared/api/http-client.ts

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


-------------------------------
src/shared/api/endpoints.ts

export const endpoints = {
  // Auth
  register: '/register',
  login: '/login',
  logout: '/logout',
  me: '/me',

  // Posts
  posts: '/posts',
  post: (id: number) => `/posts/${id}`,
  postLike: (id: number) => `/posts/${id}/like`,
  postLikes: (id: number) => `/posts/${id}/likes`,

  // Comments
  postComments: (id: number) => `/posts/${id}/comments`,
  comment: (id: number) => `/comments/${id}`,

  // Categories
  categories: '/categories',
  category: (id: number) => `/categories/${id}`,

  // Profile
  profile: '/profile',
  user: (id: number) => `/users/${id}`,

  // Upload
  uploadImage: '/upload/image',
};

📁 1. Утилиты и хелперы
-------------------------------
src/shared/lib/format.ts

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export function formatDistanceToNow(date: string): string {
    return dayjs(date).fromNow();
}

export function formatDate(date: string): string {
    return dayjs(date).format('DD.MM.YYYY');
}

export function formatDateTime(date: string): string {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}




-------------------------------
src/shared/lib/constants.ts

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



4️⃣ TypeScript типы
-------------------------------
src/shared/types/schema.ts

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  city?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PostImage {
  id: number;
  preview_url: string;
  full_url: string;
  alt_text?: string | null;
  order: number;
}

export interface Post {
  id: number;
  title: string;
  content?: string | null;
  user_id: number;
  category_id: number;
  likes_count: number;
  comments_count: number;
  published_at?: string | null;
  is_published: boolean;
  is_liked: boolean;
  user?: User;
  category?: Category;
  images?: PostImage[];
  preview_image?: PostImage;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  parent_id?: number | null;
  content: string;
  likes_count: number;
  user?: User;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
-------------------------------
src/shared/api/upload.ts

import httpClient from './http-client';
import { endpoints } from './endpoints';

export async function uploadImage(file: File): Promise<{ preview_url: string; full_url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await httpClient.post<{ success: boolean; data: { preview_url: string; full_url: string } }>(
        endpoints.uploadImage,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return data.data;
}


5️⃣ Tanstack Query провайдер
-------------------------------
src/shared/lib/query-provider.tsx


'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
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
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}



6️⃣ API хуки для постов
src/entities/post/api/usePosts.ts
-------------------------------
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/api/axios';
import { endpoints } from '@/shared/api/endpoints';
import type { Post, PaginatedResponse } from '@/shared/types/schema';

interface PostsParams {
  category_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export function usePosts(params?: PostsParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>(endpoints.posts, {
        params,
      });
      return data;
    },
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Post }>(
        endpoints.post(id)
      );
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<{ success: boolean; data: Post }>(
        endpoints.posts,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{
        success: boolean;
        is_liked: boolean;
        likes_count: number;
      }>(endpoints.postLike(postId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}


8️⃣ Главная страница с лентой
-------------------------------
src/app/page.tsx

'use client';

import { Container, Title, Stack, Pagination, Loader } from '@mantine/core';
import { usePosts } from '@/entities/post/api/usePosts';
import { PostCard } from '@/widgets/post-card/PostCard';
import { CategoryFilter } from '@/features/post/category-filter/CategoryFilter';
import { useState } from 'react';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const { data, isLoading, error } = usePosts({
    page,
    per_page: 10,
    category_id: categoryId,
  });

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Loader size="xl" color="violet" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Title order={3} c="red">
          Ошибка загрузки постов
        </Title>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl" ta="center">
        Лента постов
      </Title>

      <CategoryFilter
        value={categoryId}
        onChange={setCategoryId}
        mb="xl"
      />

      <Stack gap="lg">
        {data?.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Stack>

      {data && data.meta.last_page > 1 && (
        <Pagination
          value={page}
          onChange={setPage}
          total={data.meta.last_page}
          mt="xl"
          color="violet"
          withEdges
        />
      )}
    </Container>
  );
}


9️⃣ Layout приложения
-------------------------------
src/app/layout.tsx

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.scss';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { mantineTheme } from '@/shared/config/mantine';
import { QueryProvider } from '@/shared/lib/query-provider';
import { Header } from '@/widgets/header/Header';

export const metadata = {
  title: 'Social Network',
  description: 'Социальная сеть с постами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={mantineTheme} defaultColorScheme="light">
          <QueryProvider>
            <Notifications position="top-right" />
            <Header />
            <main>{children}</main>
          </QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}


📁 2. API хуки для всех сущностей
src/entities/category/api/useCategories.ts
-------------------------------
import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/axios';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { Category } from '@/shared/types/schema';

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Category[] }>(
        endpoints.categories
      );
      return data.data;
    },
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.categories, id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Category }>(
        endpoints.category(id)
      );
      return data.data;
    },
    enabled: !!id,
  });
}

-------------------------------
src/entities/post/api/usePosts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { Post, PaginatedResponse } from '@/shared/api/types/initial_schema';

interface PostsParams {
    category_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export function usePosts(params?: PostsParams) {
    return useQuery({
        queryKey: [QUERY_KEYS.posts, params],
        queryFn: async () => {
            const { data } = await httpClient.get<PaginatedResponse<Post>>(
                endpoints.posts,
                { params }
            );
            return data;
        },
    });
}

export function usePost(id: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.post, id],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: Post }>(
                endpoints.post(id)
            );
            return data.data;
        },
        enabled: !!id,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await httpClient.post<{ success: boolean; data: Post }>(
                endpoints.posts,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
            const { data } = await httpClient.put<{ success: boolean; data: Post }>(
                endpoints.post(id),
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.post, variables.id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await httpClient.delete<{ success: boolean }>(endpoints.post(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}

export function useToggleLike(postId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await httpClient.post<{
                success: boolean;
                is_liked: boolean;
                likes_count: number;
            }>(endpoints.postLike(postId));
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEYS.post, postId], (old: Post | undefined) => {
                if (!old) return old;
                return { ...old, is_liked: data.is_liked, likes_count: data.likes_count };
            });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        },
    });
}


-------------------------------
src/entities/comment/api/useComments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { Comment } from '@/shared/api/types/initial_schema';

export function useComments(postId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.comments, postId],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: Comment[] }>(
                endpoints.postComments(postId)
            );
            return data.data;
        },
        enabled: !!postId,
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            postId,
            content,
            parentId,
        }: {
            postId: number;
            content: string;
            parentId?: number;
        }) => {
            const { data } = await httpClient.post<{ success: boolean; data: Comment }>(
                endpoints.postComments(postId),
                { content, parent_id: parentId }
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.comments, variables.postId] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.post, variables.postId] });
        },
    });
}

export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content }: { id: number; content: string }) => {
            const { data } = await httpClient.put<{ success: boolean; data: Comment }>(
                endpoints.comment(id),
                { content }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.comments] });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await httpClient.delete<{ success: boolean }>(endpoints.comment(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.comments] });
        },
    });
}




-------------------------------
src/entities/user/api/useProfile.ts





import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';
import { QUERY_KEYS } from '@/shared/lib/constants';
import type { User } from '@/shared/api/types/initial_schema';

export function useProfile() {
    return useQuery({
        queryKey: [QUERY_KEYS.profile],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: User }>(
                endpoints.profile
            );
            return data.data;
        },
    });
}

export function useUser(id: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.user, id],
        queryFn: async () => {
            const { data } = await httpClient.get<{ success: boolean; data: User }>(
                endpoints.user(id)
            );
            return data.data;
        },
        enabled: !!id,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await httpClient.put<{ success: boolean; data: User }>(
                endpoints.profile,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEYS.profile], data.data);
        },
    });
}




📁 3. UI компоненты
-------------------------------



src/shared/ui/Avatar/Avatar.tsx




import { Avatar as MantineAvatar, AvatarProps } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

interface AppAvatarProps extends AvatarProps {
  name?: string;
  src?: string | null;
}

export function AppAvatar({ name, src, ...props }: AppAvatarProps) {
  return (
    <MantineAvatar
      src={src}
      alt={name || 'User'}
      radius="xl"
      color="violet"
      {...props}
    >
      {!src && <IconUser size={20} />}
    </MantineAvatar>
  );
}

-------------------------------
src/shared/ui/EmptyState/EmptyState.tsx

import { Center, Text, Stack } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Ничего не найдено',
  description = 'Попробуйте изменить параметры поиска',
  icon,
}: EmptyStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        {icon || <IconInbox size={64} stroke={1.5} color="var(--mantine-color-violet-5)" />}
        <Text size="lg" fw={500} ta="center">
          {title}
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </Center>
  );
}

-------------------------------
src/shared/ui/Loading/Loading.tsx

import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingProps {
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Loading({ text = 'Загрузка...', size = 'xl' }: LoadingProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <Loader size={size} color="violet" type="dots" />
        <Text size="sm" c="dimmed">
          {text}
        </Text>
      </Stack>
    </Center>
  );
}


-------------------------------
src/shared/ui/ErrorState/ErrorState.tsx

import { Center, Text, Stack, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Произошла ошибка',
  description = 'Не удалось загрузить данные',
  onRetry,
}: ErrorStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <IconAlertCircle size={64} stroke={1.5} color="var(--mantine-color-red-5)" />
        <Text size="lg" fw={500} ta="center">
          {title}
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>
        {onRetry && (
          <Button color="violet" variant="light" onClick={onRetry}>
            Попробовать снова
          </Button>
        )}
      </Stack>
    </Center>
  );
}

📁 4. Фичи
-------------------------------
src/features/post/category-filter/CategoryFilter.tsx

'use client';

import { Group, Chip, ScrollArea } from '@mantine/core';
import { useCategories } from '@/entities/category/api/useCategories';
import classes from './CategoryFilter.module.scss';

interface CategoryFilterProps {
    value?: number;
    onChange: (value: number | undefined) => void;
    className?: string;
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
    const { data: categories, isLoading } = useCategories();

    if (isLoading || !categories) return null;

    return (
        <ScrollArea className={className}>
            <Group gap="xs" wrap="nowrap">
                <Chip
                    checked={value === undefined}
                    variant={value === undefined ? 'filled' : 'light'}
                    color="violet"
                    onClick={() => onChange(undefined)}
                >
                    Все
                </Chip>

                {categories.map((category) => {
                    const isSelected = value === Number(category.id);
                    return <Chip
                        key={category.id}
                        checked={isSelected}
                        variant={value === category.id ? 'filled' : 'light'}
                        color="violet"
                        onChange={() => onChange(isSelected ? undefined : Number(category.id))}
                    >
                        {category.icon && <span style={{ marginRight: 4 }}>{category.icon}</span>}
                        {category.name}
                    </Chip>;
                })}
            </Group>
        </ScrollArea>
    );
}

-------------------------------
src/features/post/category-filter/CategoryFilter.module.scss

.root {
  padding: var(--mantine-spacing-xs) 0;
}

-------------------------------
src/features/post/create-post/CreatePostForm.tsx

'use client';

import {
  TextInput,
  Textarea,
  Select,
  FileInput,
  Button,
  Stack,
  Paper,
  Title,
  Group,
  Image,
  ActionIcon,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhoto, IconX, IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/entities/post/api/usePosts';
import { useCategories } from '@/entities/category/api/useCategories';
import { uploadImage } from '@/shared/api/upload';
import { useState } from 'react';
import classes from './CreatePostForm.module.scss';

interface ImageItem {
  file: File;
  preview: string;
  alt: string;
}

export function CreatePostForm() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createPost = useCreatePost();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      category_id: '',
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Минимум 3 символа' : null),
      category_id: (value) => (!value ? 'Выберите категорию' : null),
    },
  });

  const handleImageUpload = async (files: File[]) => {
    setUploading(true);
    try {
      const newImages: ImageItem[] = [];
      for (const file of files) {
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview, alt: '' });
      }
      setImages((prev) => [...prev, ...newImages]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category_id', values.category_id);

      for (const image of images) {
        formData.append('images[]', image.file);
        formData.append('alt_texts[]', image.alt);
      }

      await createPost.mutateAsync(formData);
      notifications.show({
        title: 'Успех',
        message: 'Пост успешно создан',
        color: 'violet',
      });
      router.push('/');
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать пост',
        color: 'red',
      });
    }
  };

  return (
    <Paper p="xl" radius="md" withBorder>
      <Title order={2} mb="lg">
        Создать пост
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Заголовок"
            placeholder="Введите заголовок поста"
            required
            {...form.getInputProps('title')}
          />

          <Select
            label="Категория"
            placeholder="Выберите категорию"
            data={categories?.map((c) => ({
              value: String(c.id),
              label: `${c.icon} ${c.name}`,
            }))}
            required
            {...form.getInputProps('category_id')}
          />

          <Textarea
            label="Содержание"
            placeholder="О чём ваш пост?"
            minRows={6}
            {...form.getInputProps('content')}
          />

          <div>
            <Text size="sm" fw={500} mb="xs">
              Изображения
            </Text>
            <FileInput
              placeholder="Выберите изображения"
              accept="image/*"
              multiple
              leftSection={<IconPhoto size={16} />}
              onChange={handleImageUpload}
              loading={uploading}
            />
          </div>

          {images.length > 0 && (
            <div className={classes.imagesGrid}>
              {images.map((image, index) => (
                <div key={index} className={classes.imageItem}>
                  <Image
                    src={image.preview}
                    alt={image.alt}
                    height={120}
                    fit="cover"
                    radius="md"
                  />
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="sm"
                    className={classes.removeButton}
                    onClick={() => removeImage(index)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              ))}
            </div>
          )}

          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              color="violet"
              loading={createPost.isPending}
              leftSection={<IconSend size={16} />}
            >
              Опубликовать
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

-------------------------------
src/features/post/create-post/CreatePostForm.module.scss

.imagesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--mantine-spacing-sm);
  margin-top: var(--mantine-spacing-sm);
}

.imageItem {
  position: relative;
  border-radius: var(--mantine-radius-md);
  overflow: hidden;
}

.removeButton {
  position: absolute;
  top: 4px;
  right: 4px;
}

-------------------------------
src/features/post/like/LikeButton.tsx

'use client';

import { ActionIcon, Group, Text } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useToggleLike } from '@/entities/post/api/usePosts';
import { formatNumber } from '@/shared/lib/format';
import classes from './LikeButton.module.scss';

interface LikeButtonProps {
  postId: number;
  isLiked: boolean;
  likesCount: number;
}

export function LikeButton({ postId, isLiked, likesCount }: LikeButtonProps) {
  const { mutate: toggleLike, isPending } = useToggleLike(postId);

  return (
    <Group gap="xs">
      <ActionIcon
        variant={isLiked ? 'filled' : 'light'}
        color="violet"
        onClick={() => toggleLike()}
        loading={isPending}
        aria-label="Like"
        className={classes.button}
      >
        {isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
      </ActionIcon>
      <Text size="sm" fw={500}>
        {formatNumber(likesCount)}
      </Text>
    </Group>
  );
}

-------------------------------
src/features/post/like/LikeButton.module.scss

.button {
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1.2);
  }
}

-------------------------------
src/features/post/comment/CommentForm.tsx

'use client';

import { Textarea, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSend } from '@tabler/icons-react';
import { useCreateComment } from '@/entities/comment/api/useComments';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
  placeholder?: string;
}

export function CommentForm({ postId, parentId, onSuccess, placeholder }: CommentFormProps) {
  const createComment = useCreateComment();

  const form = useForm({
    initialValues: { content: '' },
    validate: {
      content: (value) => (value.trim().length < 1 ? 'Введите комментарий' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createComment.mutateAsync({
        postId,
        content: values.content,
        parentId,
      });
      form.reset();
      onSuccess?.();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить комментарий',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Textarea
        placeholder={placeholder || 'Напишите комментарий...'}
        minRows={2}
        {...form.getInputProps('content')}
      />
      <Group justify="flex-end" mt="sm">
        <Button
          type="submit"
          color="violet"
          size="sm"
          loading={createComment.isPending}
          leftSection={<IconSend size={14} />}
        >
          Отправить
        </Button>
      </Group>
    </form>
  );
}


-------------------------------
src/features/post/comment/CommentItem.tsx

'use client';

import {
  Paper,
  Group,
  Text,
  Stack,
  ActionIcon,
  Collapse,
  Button,
} from '@mantine/core';
import { IconMessageCircle, IconTrash, IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { formatDistanceToNow } from '@/shared/lib/format';
import { CommentForm } from './CommentForm';
import { useDeleteComment } from '@/entities/comment/api/useComments';
import type { Comment } from '@/shared/types/schema';
import classes from './CommentItem.module.scss';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  currentUserId?: number;
  depth?: number;
}

export function CommentItem({ comment, postId, currentUserId, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const deleteComment = useDeleteComment();

    const isOwner = currentUserId === comment.user?.id;
  const maxDepth = 2;
  const isNested = depth > 0;

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      className={`${classes.comment} ${isNested ? classes.nested : ''}`}
      style={{ marginLeft: depth * 24 }}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Group gap="sm">
            <AppAvatar src={comment.user?.avatar} name={comment.user?.name} size="sm" />
            <div>
              <Text size="sm" fw={500}>
                {comment.user?.name}
              </Text>
              <Text size="xs" c="dimmed">
                {formatDistanceToNow(comment.created_at)}
              </Text>
            </div>
          </Group>

          <Group gap="xs">
                        {!isOwner && (
                            <Button
                                variant="subtle"
                                size="compact-xs"
                                color="violet"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                leftSection={<IconMessageCircle size={14} />}
                            >
                                Ответить
                            </Button>
                        )}

            {isOwner && (
              <>
                <ActionIcon variant="light" color="violet" size="sm">
                  <IconEdit size={14} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => deleteComment.mutate(comment.id)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </>
            )}
          </Group>
        </Group>

        <Text size="sm">{comment.content}</Text>

        <Collapse in={showReplyForm}>
          <CommentForm
            postId={postId}
            parentId={comment.id}
            placeholder={`Ответ ${comment.user?.name}...`}
            onSuccess={() => setShowReplyForm(false)}
          />
        </Collapse>

        {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
          <Stack gap="xs" mt="sm">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                depth={depth + 1}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

-------------------------------
src/features/post/comment/CommentItem.module.scss

.comment {
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 191, 255, 0.1);
  }
}

.nested {
  border-left: 3px solid var(--mantine-color-violet-3);
}

📁 5. Виджеты
-------------------------------
src/widgets/post-card/PostCard.tsx

'use client';

import {
    Card,
    Image,
    Text,
    Group,
    ActionIcon,
    Badge,
    Stack,
    Modal,
} from '@mantine/core';
import { IconMessageCircle, IconShare } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LikeButton } from '@/features/post/like/LikeButton';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { formatDistanceToNow, formatNumber } from '@/shared/lib/format';
import type { Post } from '@/shared/api/types/initial_schema';
import classes from './PostCard.module.scss';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter();
    const [fullImage, setFullImage] = useState<string | null>(null);

    return (
        <>
            <Card className={classes.card} shadow="sm" padding="lg">
                {post.preview_image && (
                    <Image
                        src={post.preview_image.preview_url}
                        alt={post.preview_image.alt_text || post.title}
                        height={300}
                        fit="cover"
                        radius="md"
                        className={classes.image}
                        onClick={() => setFullImage(post.preview_image!.full_url)}
                    />
                )}

                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between">
                        <Group gap="sm" onClick={() => router.push(`/users/${post.user?.id}`)} style={{ cursor: 'pointer' }}>
                            <AppAvatar src={post.user?.avatar} name={post.user?.name} size="md" />
                            <div>
                                <Text size="sm" fw={500}>
                                    {post.user?.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {formatDistanceToNow(post.published_at || post.created_at)}
                                </Text>
                            </div>
                        </Group>

                        {post.category && (
                            <Badge
                                color="violet"
                                variant="light"
                                leftSection={post.category.icon}
                            >
                                {post.category.name}
                            </Badge>
                        )}
                    </Group>
                </Card.Section>

                <Stack gap="xs" mt="md" onClick={() => router.push(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>
                    <Text size="lg" fw={600}>
                        {post.title}
                    </Text>

                    {post.content && (
                        <Text size="sm" c="dimmed" lineClamp={3}>
                            {post.content}
                        </Text>
                    )}
                </Stack>

                <Card.Section withBorder inheritPadding py="xs" mt="md">
                    <Group justify="space-between">
                        <Group gap="md">
                            <LikeButton
                                postId={post.id}
                                isLiked={post.is_liked}
                                likesCount={post.likes_count}
                            />

                            <Group gap="xs">
                                <ActionIcon variant="light" color="violet" aria-label="Comment">
                                    <IconMessageCircle size={18} />
                                </ActionIcon>
                                <Text size="sm">{formatNumber(post.comments_count)}</Text>
                            </Group>

                            <ActionIcon variant="light" color="violet" aria-label="Share">
                                <IconShare size={18} />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card.Section>
            </Card>

            <Modal
                opened={!!fullImage}
                onClose={() => setFullImage(null)}
                size="xl"
                centered
                withCloseButton={false}
            >
                <Image src={fullImage} alt="" fit="contain" />
            </Modal>
        </>
    );
}

-------------------------------
src/widgets/post-card/PostCard.module.scss

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 191, 255, 0.15);
  }
}

.image {
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.95;
  }
}

-------------------------------
src/widgets/header/Header.tsx

'use client';

import {
    Group,
    Title,
    Button,
    Menu,
} from '@mantine/core';
import { IconLogout, IconUser, IconSettings, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './Header.module.scss';
import { useAuthStore } from '@/entities/auth/model/store';
import { useMutation } from '@tanstack/react-query';
import { logoutRequest } from '@/shared/api/requests/user-request';
import Link from 'next/link';

export function Header() {
    const router = useRouter();

    const { token, removeToken } = useAuthStore()

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            removeToken(); // Очистка токена при успешном выходе из Zustand и localStorage
            router.push('/login')
        },
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    return (
        <header className={classes.header}>
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Title order={3} c="violet">
                        SocialBook
                    </Title>
                </Group>

                <Group>
                    {token ? (
                        <>
                            <Button
                                color="violet"
                                leftSection={<IconPlus size={16} />}
                                component={Link}
                                href="/posts/create"
                            >
                                Создать пост
                            </Button>
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Button variant="light" color="violet">
                                        <IconUser size={16} />
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        leftSection={<IconUser size={14} />}
                                        onClick={() => router.push('/profile')}
                                    >
                                        Профиль
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconSettings size={14} />}
                                        onClick={() => router.push('/settings')}
                                    >
                                        Настройки
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        leftSection={<IconLogout size={14} />}
                                        color="red"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </>

                    ) : (
                        <>
                            <Button variant="light" color="violet" onClick={() => router.push('/login')}>
                                Войти
                            </Button>
                            <Button color="violet" onClick={() => router.push('/register')}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
        </header>
    );
}





-------------------------------
src/widgets/feed/Feed.tsx

'use client';

import { Container, Stack, Pagination, Title } from '@mantine/core';
import { useState } from 'react';
import { usePosts } from '@/entities/post/api/usePosts';
import { PostCard } from '@/widgets/post-card/PostCard';
import { CategoryFilter } from '@/features/post/category-filter/CategoryFilter';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';

export function Feed() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const { data, isLoading, error, refetch } = usePosts({
    page,
    per_page: 10,
    category_id: categoryId,
  });

  if (isLoading) return <Loading text="Загрузка постов..." />;

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl" ta="center">
        Лента постов
      </Title>

            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <CategoryFilter value={categoryId} onChange={setCategoryId} />
            </div>

      {!data?.data || data.data.length === 0 ? (
        <EmptyState
          title="Постов пока нет"
          description="Будьте первым, кто опубликует пост!"
        />
      ) : (
        <Stack gap="lg">
          {data.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      )}

      {data && data.meta.last_page > 1 && (
        <Pagination
          value={page}
          onChange={setPage}
          total={data.meta.last_page}
          mt="xl"
          color="violet"
          withEdges
        />
      )}
    </Container>
  );
}

📁 6. Страницы
-------------------------------
src/app/page.tsx

import { Feed } from '@/widgets/feed/Feed';

export default function HomePage() {
  return <Feed />;
}

-------------------------------
src/app/posts/create/page.tsx

'use client';

import { Container } from '@mantine/core';
import { CreatePostForm } from '@/features/post/create-post/CreatePostForm';

export default function CreatePostPage() {
  return (
    <Container size="md" py="xl">
      <CreatePostForm />
    </Container>
  );
}

-------------------------------
src/app/posts/[id]/page.tsx

'use client';

import {
  Container,
  Paper,
  Stack,
  Text,
  Group,
  Badge,
  Image,
  Title,
  Divider,
  Modal,
} from '@mantine/core';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePost } from '@/entities/post/api/usePosts';
import { useComments } from '@/entities/comment/api/useComments';
import { useProfile } from '@/entities/user/api/useProfile';
import { CommentForm } from '@/features/post/comment/CommentForm';
import { CommentItem } from '@/features/post/comment/CommentItem';
import { LikeButton } from '@/features/post/like/LikeButton';
import { AppAvatar } from '@/shared/ui/Avatar/Avatar';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { formatDistanceToNow, formatDateTime } from '@/shared/lib/format';
import classes from './page.module.scss';

export default function PostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const [fullImage, setFullImage] = useState<string | null>(null);

  const { data: post, isLoading, error, refetch } = usePost(postId);
  const { data: comments } = useComments(postId);
  const { data: currentUser } = useProfile();

  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!post) return <ErrorState title="Пост не найден" />;

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Stack gap="md">
          {/* Шапка поста */}
          <Group justify="space-between">
            <Group gap="sm">
              <AppAvatar src={post.user?.avatar} name={post.user?.name} size="lg" />
              <div>
                <Text size="md" fw={600}>
                  {post.user?.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatDistanceToNow(post.published_at || post.created_at)}
                </Text>
              </div>
            </Group>

            {post.category && (
              <Badge color="violet" variant="light" leftSection={post.category.icon}>
                {post.category.name}
              </Badge>
            )}
          </Group>

          {/* Заголовок */}
          <Title order={2}>{post.title}</Title>

          {/* Изображения */}
          {post.images && post.images.length > 0 && (
            <div className={classes.imagesGrid}>
              {post.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.preview_url}
                  alt={image.alt_text || ''}
                  height={200}
                  fit="cover"
                  radius="md"
                  className={classes.image}
                  onClick={() => setFullImage(image.full_url)}
                />
              ))}
            </div>
          )}

          {/* Содержание */}
          {post.content && (
            <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Text>
          )}

          <Divider />

          {/* Действия */}
          <Group justify="space-between">
            <LikeButton
              postId={post.id}
              isLiked={post.is_liked}
              likesCount={post.likes_count}
            />
            <Text size="sm" c="dimmed">
              {formatDateTime(post.created_at)}
            </Text>
          </Group>
        </Stack>
      </Paper>

      {/* Комментарии */}
      <Paper p="xl" radius="md" withBorder mt="lg">
        <Title order={3} mb="md">
          Комментарии ({post.comments_count})
        </Title>

        <CommentForm postId={postId} />

        <Stack gap="sm" mt="lg">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                currentUserId={currentUser?.id}
              />
            ))
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Пока нет комментариев. Будьте первым!
            </Text>
          )}
        </Stack>
      </Paper>

      {/* Модальное окно для полного изображения */}
      <Modal
        opened={!!fullImage}
        onClose={() => setFullImage(null)}
        size="xl"
        centered
        withCloseButton={false}
      >
        <Image src={fullImage} alt="" fit="contain" />
      </Modal>
    </Container>
  );
}

-------------------------------
src/app/posts/[id]/page.module.scss

.imagesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--mantine-spacing-sm);
}

.image {
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
}


-------------------------------
src/app/profile/page.tsx

'use client';

import {
  Container,
  Paper,
  Stack,
  Text,
  Group,
  Avatar,
  Title,
  Badge,
  Button,
  TextInput,
  Textarea,
  FileInput,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCamera, IconSave } from '@tabler/icons-react';
import { useProfile, useUpdateProfile } from '@/entities/user/api/useProfile';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { formatDate } from '@/shared/lib/format';
import classes from './page.module.scss';

export default function ProfilePage() {
  const { data: user, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      city: user?.city || '',
      birth_date: user?.birth_date || '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Минимум 2 символа' : null),
    },
  });

  // Обновляем форму при загрузке данных
  if (user && !form.values.name) {
    form.setValues({
      name: user.name,
      bio: user.bio || '',
      phone: user.phone || '',
      city: user.city || '',
      birth_date: user.birth_date || '',
    });
  }

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('bio', values.bio);
      formData.append('phone', values.phone);
      formData.append('city', values.city);
      if (values.birth_date) formData.append('birth_date', values.birth_date);

      await updateProfile.mutateAsync(formData);
      notifications.show({
        title: 'Успех',
        message: 'Профиль обновлён',
        color: 'violet',
      });
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить профиль',
        color: 'red',
      });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!user) return <ErrorState title="Профиль не найден" />;

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Stack gap="xl">
          {/* Аватар и основная информация */}
          <Group align="flex-start">
            <Avatar
              src={user.avatar}
              size={120}
              radius="xl"
              color="violet"
              className={classes.avatar}
            >
              {!user.avatar && <IconCamera size={40} />}
            </Avatar>

            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={2}>{user.name}</Title>
              <Text c="dimmed">{user.email}</Text>
              {user.city && <Badge color="violet" variant="light">{user.city}</Badge>}
              <Text size="sm" c="dimmed">
                Регистрация: {formatDate(user.created_at)}
              </Text>
            </Stack>
          </Group>

          <Divider />

          {/* Форма редактирования */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Имя"
                placeholder="Ваше имя"
                required
                {...form.getInputProps('name')}
              />

              <Textarea
                label="О себе"
                placeholder="Расскажите о себе"
                minRows={3}
                {...form.getInputProps('bio')}
              />

              <TextInput
                label="Телефон"
                placeholder="+7 (999) 123-45-67"
                {...form.getInputProps('phone')}
              />

              <TextInput
                label="Город"
                placeholder="Ваш город"
                {...form.getInputProps('city')}
              />

              <TextInput
                label="Дата рождения"
                type="date"
                {...form.getInputProps('birth_date')}
              />

              <FileInput
                label="Аватар"
                placeholder="Выберите изображение"
                accept="image/*"
                leftSection={<IconCamera size={16} />}
              />

              <Button
                type="submit"
                color="violet"
                loading={updateProfile.isPending}
                leftSection={<IconSave size={16} />}
              >
                Сохранить изменения
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}


-------------------------------
src/app/profile/page.module.scss

.avatar {
  border: 3px solid var(--mantine-color-violet-3);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}


-------------------------------
src/app/users/[id]/page.tsx

'use client';

import {
  Container,
  Paper,
  Stack,
  Text,
  Group,
  Avatar,
  Title,
  Badge,
} from '@mantine/core';
import { useParams } from 'next/navigation';
import { useUser } from '@/entities/user/api/useUser';
import { usePosts } from '@/entities/post/api/usePosts';
import { PostCard } from '@/widgets/post-card/PostCard';
import { Loading } from '@/shared/ui/Loading/Loading';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { formatDate } from '@/shared/lib/format';
import classes from './page.module.scss';

export default function UserProfilePage() {
  const params = useParams();
  const userId = Number(params.id);

  const { data: user, isLoading, error, refetch } = useUser(userId);
  const { data: postsData } = usePosts({ per_page: 100 });

  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!user) return <ErrorState title="Пользователь не найден" />;

  const userPosts = postsData?.data.filter((p) => p.user_id === userId) || [];

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder mb="xl">
        <Group align="flex-start">
          <Avatar
            src={user.avatar}
            size={120}
            radius="xl"
            color="violet"
            className={classes.avatar}
          />

          <Stack gap="xs" style={{ flex: 1 }}>
            <Title order={2}>{user.name}</Title>
            <Text c="dimmed">{user.email}</Text>

            {user.bio && (
              <Text size="sm" mt="sm">
                {user.bio}
              </Text>
            )}

            <Group gap="sm" mt="sm">
              {user.city && <Badge color="violet" variant="light">{user.city}</Badge>}
              {user.birth_date && (
                <Badge color="violet" variant="light">
                  {formatDate(user.birth_date)}
                </Badge>
              )}
            </Group>

            <Text size="xs" c="dimmed" mt="sm">
              Регистрация: {formatDate(user.created_at)}
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Title order={3} mb="md">
        Посты пользователя ({userPosts.length})
      </Title>

      <Stack gap="lg">
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Paper p="xl" radius="md" withBorder ta="center">
            <Text c="dimmed">У пользователя пока нет постов</Text>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}


-------------------------------
src/app/users/[id]/page.module.scss

.avatar {
  border: 3px solid var(--mantine-color-violet-3);
}

-------------------------------
src/app/settings/page.tsx

'use client';

import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Switch,
  Divider,
  Button,
  Group,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBell, IconShield, IconPalette } from '@tabler/icons-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        Настройки
      </Title>

      <Stack gap="lg">
        {/* Уведомления */}
        <Paper p="xl" radius="md" withBorder>
          <Group mb="md">
            <IconBell size={24} color="var(--mantine-color-violet-5)" />
            <Title order={3}>Уведомления</Title>
          </Group>

          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={500}>Push-уведомления</Text>
                <Text size="sm" c="dimmed">
                  Получать уведомления о новых лайках и комментариях
                </Text>
              </div>
              <Switch
                color="violet"
                checked={notificationsEnabled}
                onChange={(event) => setNotificationsEnabled(event.currentTarget.checked)}
              />
            </Group>

            <Divider />

            <Group justify="space-between">
              <div>
                <Text fw={500}>Email-уведомления</Text>
                <Text size="sm" c="dimmed">
                  Получать уведомления на почту
                </Text>
              </div>
              <Switch
                color="violet"
                checked={emailNotifications}
                onChange={(event) => setEmailNotifications(event.currentTarget.checked)}
              />
            </Group>
          </Stack>
        </Paper>

        {/* Внешний вид */}
        <Paper p="xl" radius="md" withBorder>
          <Group mb="md">
            <IconPalette size={24} color="var(--mantine-color-violet-5)" />
            <Title order={3}>Внешний вид</Title>
          </Group>

          <Group justify="space-between">
            <div>
              <Text fw={500}>Тёмная тема</Text>
              <Text size="sm" c="dimmed">
                Использовать тёмную тему оформления
              </Text>
            </div>
            <Switch
              color="violet"
              checked={darkMode}
              onChange={(event) => setDarkMode(event.currentTarget.checked)}
            />
          </Group>
        </Paper>

        {/* Безопасность */}
        <Paper p="xl" radius="md" withBorder>
          <Group mb="md">
            <IconShield size={24} color="var(--mantine-color-violet-5)" />
            <Title order={3}>Безопасность</Title>
          </Group>

          <Stack gap="md">
            <Button variant="light" color="violet">
              Изменить пароль
            </Button>
            <Button variant="light" color="violet">
              Двухфакторная аутентификация
            </Button>
          </Stack>
        </Paper>

        <Button
          color="violet"
          onClick={() =>
            notifications.show({
              title: 'Успех',
              message: 'Настройки сохранены',
              color: 'violet',
            })
          }
        >
          Сохранить настройки
        </Button>
      </Stack>
    </Container>
  );
}

📁 7. Глобальные стили
-------------------------------
src/app/globals.scss

:root {
  --primary-color: #00bfff;
  --background-color: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--background-color);
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

// Анимации
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fadeIn {
  animation: fadeIn 0.3s ease;
}

// Скроллбар
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0099cc;
}

📁 8. Layout приложения
-------------------------------
src/app/layout.tsx

import type { Metadata } from 'next';
import { ProviderWrapper } from './providers/providers';
import { ColorSchemeScript } from '@mantine/core';

export const metadata: Metadata = {
  title: 'Social Network',
  description: 'Социальная сеть с постами',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
      </head>
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}

-------------------------------
app/providers/providers.tsx


'use client';


import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './globals.scss';
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

-------------------------------


📁 9. Конфигурация Next.js
-------------------------------
next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  transpilePackages: ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/dates'],
};

module.exports = nextConfig;


-------------------------------
.env.local

NEXT_PUBLIC_API_URL=http://localhost:8000/api

-------------------------------
tsconfig.json

{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

🚀 Запуск приложения
-------------------------------
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
npm start



-------------------------------
-------------------------------
-------------------------------
-------------------------------

```