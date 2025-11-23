import { AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ErrorProps {
    error?: Error;
}

export const ErrorComponent = ({ error }: ErrorProps) => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Something went wrong
                </h2>
                <p className="text-sm text-gray-500">
                    {error?.message || "An unexpected error occurred. Please try again."}
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
