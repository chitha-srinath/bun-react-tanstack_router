import { TodoSheet } from "@/components/todos/todo-sheet";
import { TodoListVirtual } from "@/components/todos/todo-list-virtual";
import { type Todo } from "@/lib/api/todos";
import { createMutationOptions, deleteMutationOptions, toggleMutationOptions, updateMutationOptions } from "@/lib/mutation-options";
import { todosQueryOptions } from "@/lib/query-options";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";


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

  const handleEdit = useCallback((todo: Todo) => {
    setSelectedTodo(todo);
    setIsSheetOpen(true);
  }, []);

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
    // <div
    //   className="flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white overflow-y-auto"
    //   style={{
    //     backgroundImage:
    //       "radial-gradient(50% 50% at 95% 5%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)",
    //   }}
    // >
    <div className="w-full flex flex-col gap-4 p-4">
      <TodoHeader
        title="Todo List (Infinite Query)"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreate={handleCreate}
      />

      {error ? (
        <div className="flex items-center justify-center py-20 text-red-400">
          Error: {error instanceof Error ? error?.message : "Unknown error"}
        </div>
      ) : (
        <TodoListVirtual
          todos={todos}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onEdit={handleEdit}
          onDelete={useCallback((id: string) => deleteMutation.mutate(id), [deleteMutation])}
          onToggle={useCallback((id: string, newStatus: boolean) => {
            toggleMutation.mutate({ id, completed: newStatus });
          }, [toggleMutation])}
        />
      )}

      <TodoSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleSave}
        todo={selectedTodo}
      />
    </div>
    // </div>
  );
}
