import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth.store";

export const useGoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { loadUserFromToken } = useAuthStore();
    const navigate = useNavigate();

    // We need to parse the search params. 
    // Since we are using TanStack Router, we can use useSearch if we are in a route context,
    // or just window.location.search if we want to be generic.
    // However, the Login route defined in login.tsx has validateSearch.
    // Let's assume this hook is used in the Login component.

    useEffect(() => {
        const handleGoogleLogin = async () => {
            const params = new URLSearchParams(window.location.search);
            const accessToken = params.get("token");

            if (accessToken) {
                setIsLoading(true);
                try {
                    // Verify and load user
                    await loadUserFromToken(accessToken);

                    // Clear the query param to keep URL clean
                    window.history.replaceState({}, document.title, window.location.pathname);

                    // Redirect to home or dashboard
                    await navigate({ to: "/home" });
                } catch (error) {
                    console.error("Google login failed", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        handleGoogleLogin();
    }, [loadUserFromToken, navigate]);

    return { isLoading };
};
