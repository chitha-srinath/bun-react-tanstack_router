import { StrictMode, useMemo, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import type { AuthState } from "./stores/auth.store.ts";
import { useAuthStore } from "./stores/auth.store.ts";
import { Loading } from "./components/Loading";

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    auth: undefined as unknown as AuthState,
    queryClient: TanStackQueryProviderContext.queryClient,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  // Create a component to handle dynamic auth context updates
  function App() {
    const authState = useAuthStore();

    useEffect(() => {
      // Check for session on mount
      authState.getAccessToken();
    }, []);

    const routerContext = useMemo(
      () => ({
        auth: authState,
        queryClient: TanStackQueryProviderContext.queryClient,
      }),
      [authState]
    );

    if (authState.isInitializing) {
      return <Loading />;
    }

    // Attempt to restore session on mount
    // We use useMemo with empty dependency to run once, or useEffect. 
    // Since this is a side effect, useEffect is better.
    // Wait, I can't put useEffect inside useMemo block in the tool. 
    // I will use the tool to insert useEffect before routerContext.


    return (
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} context={routerContext} />
      </TanStackQueryProvider.Provider>
    );
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
