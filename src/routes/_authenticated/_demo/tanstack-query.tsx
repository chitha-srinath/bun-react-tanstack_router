import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { todosQueryOptions } from "@/lib/query-options";

export const Route = createFileRoute("/_authenticated/_demo/tanstack-query")({
  component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
  const { data, error, isLoading } = useQuery(todosQueryOptions);
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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            Error: {error instanceof Error ? error?.message : "Unknown error"}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
