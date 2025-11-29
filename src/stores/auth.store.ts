import { create } from "zustand";
import apiFetch from "../lib/api";

interface User {
    id: number;
    username?: string;
    email: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isInitializing: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    loadUserFromToken: (token: string) => Promise<void>;
    setToken: (token: string) => void;
    getAccessToken: () => Promise<boolean>;
    verifyToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(

    (set, get) => ({
        isAuthenticated: false,
        user: null,
        token: null,
        isInitializing: true,

        setToken: (token: string) => set({ token }),

        login: async (email: string, password: string) => {
            try {
                // API call to login endpoint
                const response = await apiFetch.post("/auth/login", {
                    email,
                    password,
                });

                set({
                    isAuthenticated: true,
                    user: response.data.data.user,
                    token: response.data.data.token
                });
                return true;
            } catch (error) {
                console.error("Login error:", error);
                return false;
            }
        },

        register: async (username: string, email: string, password: string) => {
            try {
                // API call to register endpoint
                const response = await apiFetch.post("/auth/register", {
                    username,
                    email,
                    password
                });

                set({
                    isAuthenticated: true,
                    user: response.data.data.user,
                    token: response.data.data.token
                });
                return true;
            } catch (error) {
                console.error("Registration error:", error);
                return false;
            }
        },

        logout: async () => {
            // API call to logout endpoint
            const token = get().token;
            if (token) {
                try {
                    await apiFetch.get("/auth/logout");
                } catch (error) {
                    console.error("Logout error:", error);
                }
            }

            set({
                isAuthenticated: false,
                user: null,
                token: null
            });
        },

        loadUserFromToken: async (token: string) => {
            try {
                // API call to get current user
                // We set the token in the store first so apiFetch can use it
                set({ token });

                const response = await apiFetch.get(`/auth/user-details`);

                set({
                    isAuthenticated: true,
                    user: response.data.data,
                    token // Ensure token is set
                });
            } catch (error) {
                console.error("Load user error:", error);
                // Clear auth state if token is invalid
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null
                });
            }
        },

        getAccessToken: async () => {
            try {
                // Try to refresh token to check if user is authenticated
                const response = await apiFetch.get("/auth/access-token");

                // The token is directly in response.data.data
                const newToken = response.data.data;

                set({
                    token: newToken
                });
                // use loadUserFromToken to fetch user details
                await get().loadUserFromToken(newToken);
                return true;
            } catch (error) {
                console.error("getAccessToken error:", error);
                set({ isAuthenticated: false, user: null, token: null });
                return false;
            } finally {
                set({ isInitializing: false });
            }
        },
        verifyToken: async () => {
            try {
                const response = await apiFetch.get("/auth/verify-access-token");
                set({ isAuthenticated: true, user: response.data.data.user });
                return true;
            } catch (error) {
                set({ isAuthenticated: false, user: null });
                return false;
            }
        }
    }
    )
);