import { type QueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, toggleTodo, updateTodo, type Todo } from "./api/todos";
import { QUERY_KEYS } from "./constants";

export const createMutationOptions = (queryClient: QueryClient) => ({
    mutationFn: createTodo,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
});

export const updateMutationOptions = (queryClient: QueryClient) => ({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) => updateTodo(id, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
});

export const deleteMutationOptions = (queryClient: QueryClient) => ({
    mutationFn: deleteTodo,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
});

export const toggleMutationOptions = (queryClient: QueryClient) => ({
    mutationFn: toggleTodo,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.todos] });
    },
});
