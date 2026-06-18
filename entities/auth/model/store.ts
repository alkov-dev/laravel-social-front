import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    removeToken: () => void;
    checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            isAuthenticated: false,

            setToken: (token) => set({ token, isAuthenticated: true }),

            removeToken: () => set({ token: null, isAuthenticated: false }),

            checkAuth: () => {
                const state = get();
                return !!state.token;
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                // При восстановлении из localStorage обновляем isAuthenticated
                if (state?.token) {
                    state.isAuthenticated = true;
                }
            },
        }
    )
);


