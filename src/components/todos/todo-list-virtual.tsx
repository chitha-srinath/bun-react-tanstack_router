"use client"

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef, useEffect } from "react"
import { fetchTodos, deleteTodo, updateTodo, type Todo } from "@/lib/api/todos"
import { TodoCard } from "@/components/todo-card"
import { Spinner } from "@/components/ui/Spinner"
import { useToast } from "@/hooks/use-toast"

interface TodoListVirtualProps {
    onEdit: (todo: Todo) => void
}

export function TodoListVirtual({ onEdit }: TodoListVirtualProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const parentRef = useRef<HTMLDivElement>(null)

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: ["todos"],
        queryFn: fetchTodos,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    // Flatten all pages into a single array
    const allTodos = data?.pages.flatMap((page) => page.posts) ?? []

    const virtualizer = useVirtualizer({
        count: Math.ceil(allTodos.length / 3), // Assuming 3 columns on desktop
        getScrollElement: () => parentRef.current,
        estimateSize: () => 300,
        overscan: 5,
    })

    const virtualItems = virtualizer.getVirtualItems()

    useEffect(() => {
        const [lastItem] = [...virtualItems].reverse()

        if (!lastItem) return

        if (lastItem.index >= Math.ceil(allTodos.length / 3) - 1 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, fetchNextPage, allTodos.length, isFetchingNextPage, virtualItems])

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Todo> }) => updateTodo(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] })
            const previousData = queryClient.getQueryData(["todos"])

            queryClient.setQueryData(["todos"], (old: any) => ({
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    todos: page.todos.map((todo: Todo) => (todo.id === id ? { ...todo, ...data } : todo)),
                })),
            }))

            return { previousData }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["todos"], context?.previousData)
            toast({
                title: "Error",
                description: "Failed to update todo",
                variant: "destructive",
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] })
            const previousData = queryClient.getQueryData(["todos"])

            queryClient.setQueryData(["todos"], (old: any) => ({
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    todos: page.todos.filter((todo: Todo) => todo.id !== id),
                })),
            }))

            return { previousData }
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["todos"], context?.previousData)
            toast({
                title: "Error",
                description: "Failed to delete todo",
                variant: "destructive",
            })
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Todo deleted successfully",
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        },
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner className="h-8 w-8" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-background/50">
                <p className="text-destructive text-lg">Failed to load todos. Please try again.</p>
            </div>
        )
    }

    if (allTodos.length === 0) {
        return (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-background/50">
                <p className="text-muted-foreground text-lg">No tasks found. Start by creating one!</p>
            </div>
        )
    }

    return (
        <div ref={parentRef} className="h-[calc(100vh-350px)] overflow-auto px-4">
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                        const rowItems = [
                            allTodos[virtualRow.index * 3],
                            allTodos[virtualRow.index * 3 + 1],
                            allTodos[virtualRow.index * 3 + 2],
                        ].filter(Boolean)

                        return (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 p-3"
                            >
                                {rowItems.map((todo) => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        onEdit={onEdit}
                                        onDelete={(id) => deleteMutation.mutate(id)}
                                        onToggle={(id) => updateMutation.mutate({ id, data: { completed: !todo.completed } })}
                                    />
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
