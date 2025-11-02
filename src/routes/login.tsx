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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
    </div>
  );
}
