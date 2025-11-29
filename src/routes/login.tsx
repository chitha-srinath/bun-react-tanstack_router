import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export const Route = createFileRoute("/login")({
  validateSearch: (search: { redirect?: string }) => ({
    redirect: search.redirect,
  }),
  component: Login,
  beforeLoad: async ({ search, context }) => {
    // Check if user is authenticated
    const isAuthenticated = context.auth.isAuthenticated;
    if (isAuthenticated) {
      // Redirect to the saved location or home page if authenticated
      throw redirect({
        to: search.redirect || "/",
      });
    }
  },
});

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            {isLogin ? "Welcome Back" : "Join Us"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to get started"}
          </p>
        </div> */}

        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
}
