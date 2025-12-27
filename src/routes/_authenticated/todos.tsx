import { TodoHeader } from "@/components/todos/todo-header";
import { TodoSheet } from "@/components/todos/todo-sheet";
import { TodosProvider, type TodosContextType } from "@/components/todos/todos-context";
import { type Todo } from "@/lib/api/todos";
import { createMutationOptions, deleteMutationOptions, toggleMutationOptions, updateMutationOptions } from "@/lib/mutation-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useCallback, useState } from "react";

type TodosSearch = {
  search?: string;
};

export const Route = createFileRoute("/_authenticated/todos")({
  component: TodosLayout,
  validateSearch: (search: Record<string, unknown>): TodosSearch => {
    return {
      search: (search.search as string) || "",
    };
  },
});


function TodosLayout() {
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

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

  const context: TodosContextType = {
    onEdit: handleEdit,
    onDelete: useCallback((id: string) => deleteMutation.mutate(id), [deleteMutation]),
    onToggle: useCallback((id: string, newStatus: boolean) => {
      toggleMutation.mutate({ id, completed: newStatus });
    }, [toggleMutation])
  };

  return (
    <TodosProvider value={context}>
      <div className="w-full flex flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
        <TodoHeader
          title="Todo List"
          searchQuery={search || ""}
          setSearchQuery={(val) => navigate({ search: { search: val }, replace: true })}
          onCreate={handleCreate}
        />

        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <Link
            to="/todos"
            activeProps={{ className: "font-bold text-primary border-b-2 border-primary" }}
            className="px-4 py-2 hover:text-primary transition-colors"
            activeOptions={{ exact: true }}
            search={{ search }}
          >
            Infinite Scroll
          </Link>
          <Link
            to="/todos/virtual"
            activeProps={{ className: "font-bold text-primary border-b-2 border-primary" }}
            className="px-4 py-2 hover:text-primary transition-colors"
            search={{ search }}
          >
            Virtualizer
          </Link>
        </div>

        {/* Removed Error boundary around outlet as data fetching is in child */}
        <Outlet />

        <TodoSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onSave={handleSave}
          todo={selectedTodo}
        />
      </div>
    </TodosProvider>
  );
}
