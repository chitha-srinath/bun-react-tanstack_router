import axios, { type AxiosError } from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/auth.store";

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(async (config) => {
    const { token } = useAuthStore.getState();

    if (!token) {
        return config;
    }
    const decodedToken = jwtDecode<{ exp: number }>(token);
    // check 30 second buffer to refresh before actual expiration
    const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 30000;
    if (isExpired) {
        await useAuthStore.getState().getAccessToken();
    }
    config.headers.Authorization = `Bearer ${token}`;

    return config;
});

// Response interceptor - Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401)

            useAuthStore.setState({
                isAuthenticated: false,
                user: null,
                token: null
            });
        return Promise.reject(error);
    }


);

export default api;
