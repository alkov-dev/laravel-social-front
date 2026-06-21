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