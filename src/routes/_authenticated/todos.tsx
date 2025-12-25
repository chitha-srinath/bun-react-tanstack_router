import { TodoCard } from "@/components/todos/todo-card";
import { TodoSheet } from "@/components/todos/todo-sheet";
import { Button } from "@/components/ui/Button";
import { type Todo } from "@/lib/api/todos";
import { createMutationOptions, deleteMutationOptions, toggleMutationOptions, updateMutationOptions } from "@/lib/mutation-options";
import { todosQueryOptions } from "@/lib/query-options";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";


import { TodoHeader } from "@/components/todos/todo-header";

export const Route = createFileRoute("/_authenticated/todos")({
  component: Todos,
});

function Todos() {
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(todosQueryOptions({ search: searchQuery }));

  const createMutation = useMutation({
    ...createMutationOptions(queryClient),
    onSuccess: () => {
      createMutationOptions(queryClient).onSuccess();
      setIsSheetOpen(false);
    }
  });

  const updateMutation = useMutation({
    ...updateMutationOptions(queryClient),
    onSuccess: () => {
      updateMutationOptions(queryClient).onSuccess();
      setIsSheetOpen(false);
      setSelectedTodo(null);
    }
  });

  const deleteMutation = useMutation(deleteMutationOptions(queryClient));

  const toggleMutation = useMutation(toggleMutationOptions(queryClient));

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedTodo(null);
    setIsSheetOpen(true);
  };

  const handleSave = async (todoData: Partial<Todo>) => {
    if (selectedTodo) {
      await updateMutation.mutateAsync({ id: selectedTodo.id, data: todoData });
    } else {
      if (!todoData.title) return;
      await createMutation.mutateAsync({
        title: todoData.title,
        description: todoData.description ?? undefined,
      });
    }
  };

  // Flatten the pages to get all todos
  const todos = data?.pages.flatMap((page) => page.data.todos) ?? [];



  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white overflow-y-auto"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 95% 5%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)",
      }}
    >
      <div className="w-full max-w-4xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10 my-10 relative">
        <TodoHeader
          title="Todo List (Infinite Query)"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreate={handleCreate}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-400">
            Error: {error instanceof Error ? error?.message : "Unknown error"}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={handleEdit}
                  onDelete={(id) => deleteMutation.mutate(id.toString())}
                  onToggle={(id) => toggleMutation.mutate({ id: id.toString(), completed: !todo.completed })}
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="secondary"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load More"}
                </Button>
              </div>
            )}

            {todos.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                No todos found.
              </div>
            )}
          </div>
        )}

        <TodoSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onSave={handleSave}
          todo={selectedTodo}
        />
      </div>
    </div>
  );
}
