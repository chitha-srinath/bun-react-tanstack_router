"use client"

import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { createTodo, updateTodo, deleteTodo, toggleTodo, type Todo } from "@/lib/api/todos"
import { todosQueryOptions } from "@/lib/query-options"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function useTodos(searchQuery?: string) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 400) // 400ms debounce
        return () => clearTimeout(handler)
    }, [searchQuery])

    const todosQuery = useInfiniteQuery(todosQueryOptions({ search: debouncedSearch }))

    const createMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
            toast({
                title: "Success",
                description: "Todo created successfully",
            })
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create todo",
                variant: "destructive",
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) => updateTodo(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
            toast({
                title: "Success",
                description: "Todo updated successfully",
            })
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update todo",
                variant: "destructive",
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
            toast({
                title: "Success",
                description: "Todo deleted successfully",
            })
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete todo",
                variant: "destructive",
            })
        },
    })

    const toggleMutation = useMutation({
        mutationFn: toggleTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to toggle todo",
                variant: "destructive",
            })
        },
    })

    const allTodos = todosQuery.data?.pages.flatMap((page) => page.data.todos) ?? []

    const stats = {
        total: allTodos.length,
        completed: allTodos.filter((t) => t.completed).length,
        pending: allTodos.filter((t) => !t.completed).length,
    }

    return {
        todos: allTodos,
        stats,
        isLoading: todosQuery.isLoading,
        isError: todosQuery.isError,
        hasNextPage: todosQuery.hasNextPage,
        fetchNextPage: todosQuery.fetchNextPage,
        isFetchingNextPage: todosQuery.isFetchingNextPage,
        createTodo: createMutation.mutateAsync,
        updateTodo: updateMutation.mutateAsync,
        deleteTodo: deleteMutation.mutateAsync,
        toggleTodo: toggleMutation.mutateAsync,
    }
}

