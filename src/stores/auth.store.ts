import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            token: null,

            login: async (email, password) => {
                try {
                    // API call to login endpoint
                    // const response = await fetch("/api/auth/login", {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
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
                            token: ""
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

            register: async (username, email, password) => {
                try {
                    // API call to register endpoint
                    const response = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, email, password }),
                    });

                    if (!response.ok) {
                        throw new Error("Registration failed");
                    }

                    const data = await response.json();

                    set({
                        isAuthenticated: true,
                        user: data.data.user,
                        token: data.data.token
                    });
                    return true;
                } catch (error) {
                    console.error("Registration error:", error);
                    return false;
                }
            },

            logout: () => {
                // API call to logout endpoint
                const token = useAuthStore.getState().token;
                fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                }).catch(console.error);

                set({
                    isAuthenticated: false,
                    user: null,
                    token: null
                });
                // Removed redirect call - navigation should be handled in components
            },

            loadUserFromToken: async (token) => {
                try {
                    // API call to get current user
                    const response = await fetch(`/api/auth/me?token=${token}`);

                    if (!response.ok) {
                        throw new Error("Failed to load user");
                    }

                    const data = await response.json();

                    set({
                        isAuthenticated: true,
                        user: data.data.user,
                        token
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
            }
        }),
        {
            name: "auth-storage", // name of the item in the storage (must be unique)
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                token: state.token
            }),
        }
    )
);