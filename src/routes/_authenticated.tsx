import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location, search }) => {
    // Check if access-token is present in query params
    const accessToken = (search as { "access-token"?: string })["access-token"];

    if (accessToken) {
      // Verify and load user data from the token
      const authStore = useAuthStore.getState();
      await authStore.loadUserFromToken(accessToken);

      // Clean up the URL by removing the access-token query param
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete("access-token");
      const newSearch = searchParams.toString();
      const newPath = location.pathname + (newSearch ? `?${newSearch}` : "");

      // Redirect to clean URL
      throw redirect({
        to: newPath,
        replace: true,
      });
    }

    // Check if user is authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
