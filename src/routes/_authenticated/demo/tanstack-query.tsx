import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/demo/tanstack-query")({
  component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      // Use standard fetch instead of RPC for now
      const response = await fetch("/api/todos");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data?.todos || [];
    },
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 95% 5%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)",
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h1 className="text-2xl mb-4">
          TanStack Query Simple Promise Handling
        </h1>
        <ul className="mb-4 space-y-2">
          {Array.isArray(data) &&
            data.map((todo: { id: number; title: string }) => (
              <li
                key={todo.id}
                className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md"
              >
                <span className="text-lg text-white">{todo.title}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
