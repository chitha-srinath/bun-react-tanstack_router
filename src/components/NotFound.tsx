import { FileQuestion } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const NotFound = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-blue-100 p-3">
                    <FileQuestion className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Page Not Found
                </h2>
                <p className="text-sm text-gray-500">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
};