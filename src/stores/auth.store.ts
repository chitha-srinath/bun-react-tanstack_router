import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loadUserFromToken: (token: string) => Promise<void>;
    setToken: (token: string) => void;
    checkAuth: () => Promise<boolean>;
    verifyToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            token: null,

            setToken: (token: string) => set({ token }),

            login: async (email: string, password: string) => {
                try {
                    // API call to login endpoint
                    // const response = await apiFetch("/api/auth/login", {
                    //     method: "POST",
                    //     body: JSON.stringify({ email, password }),
                    // });

                    // if (!response.ok) {
                    //     throw new Error("Login failed");
                    // }

                    // const data = await response.json();

                    if (email === "test@test.com" && password === "password") {
                        set({
                            isAuthenticated: true,
                            user: { id: 1, username: "test", email: "test@test.com" },
                            token: "mock_token"
                        });
                        return true;
                    } else {
                        throw new Error("Login failed");
                    }
                } catch (error) {
                    console.error("Login error:", error);
                    return false;
                }
            },

            register: async (username: string, email: string, password: string) => {
                try {
                    // API call to register endpoint
                    const response = await apiFetch.post("/api/auth/register", {
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

            logout: () => {
                // API call to logout endpoint
                const token = get().token;
                if (token) {
                    apiFetch.post("/api/auth/logout", { token }).catch(console.error);
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

                    const response = await apiFetch.get(`/api/auth/me`);

                    set({
                        isAuthenticated: true,
                        user: response.data.data.user,
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

            checkAuth: async () => {
                try {
                    // Try to refresh token to check if user is authenticated
                    const response = await fetch("/api/auth/refresh", {
                        method: "POST",
                        credentials: "include"
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const token = data.data.token;

                        set({ token });

                        // Fetch user details
                        const userResponse = await apiFetch.get("/api/auth/me");
                        set({
                            isAuthenticated: true,
                            user: userResponse.data.data.user,
                            token
                        });
                        return true;
                    }

                    set({ isAuthenticated: false, user: null, token: null });
                    return false;
                } catch (error) {
                    set({ isAuthenticated: false, user: null, token: null });
                    return false;
                }
            },
            verifyToken: async () => {
                try {
                    const response = await apiFetch.get("/api/auth/verify");
                    set({ isAuthenticated: true, user: response.data.data.user });
                    return true;
                } catch (error) {
                    set({ isAuthenticated: false, user: null });
                    return false;
                }
            }
        }),
        {
            name: "auth-storage", // name of the item in the storage (must be unique)
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                // token: state.token // Do not persist token
            }),
        }
    )
);