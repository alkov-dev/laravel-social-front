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