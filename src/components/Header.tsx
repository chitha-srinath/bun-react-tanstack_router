import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogIn, LogOut, Menu, Network, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    // Navigate to login page after logout
    navigate({ to: "/login", search: { redirect: "/" } });
  };

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/home"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Demo Links Start */}
          {isAuthenticated && (
            <Link
              to="/tanstack-query"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
              }}
            >
              <Network size={20} />
              <span className="font-medium">TanStack Query</span>
            </Link>
          )}
          {/* Demo Links End */}

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
                }}
              >
                <Home size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2 w-full text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              search={{ redirect: "/" }}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
              }}
            >
              <LogIn size={20} />
              <span className="font-medium">Login</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
