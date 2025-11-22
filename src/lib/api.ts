import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/auth.store";

// Create axios instance with default config
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let isRefreshing = false;

// Request interceptor - Add auth token to requests
api.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
                const newToken = data?.data?.token;

                if (newToken) {
                    useAuthStore.getState().setToken(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    isRefreshing = false;
                    return api(originalRequest);
                }
            } catch {
                isRefreshing = false;
                useAuthStore.getState().logout();
            }
        }

        return Promise.reject(error);
    }
);

export default api;
