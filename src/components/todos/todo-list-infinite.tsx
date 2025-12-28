import { Spinner } from "@/components/ui/Spinner";
import { type Todo } from "@/lib/api/todos";
import { FolderCode } from "lucide-react";
import { useEffect, useRef } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { TodoCard, TodoCardSkeleton } from "./todo-card";

interface TodoListInfiniteProps {
    todos: Todo[];
    isLoading: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string, newStatus: boolean) => void;
    searchText: string
}

export function TodoListInfinite({
    todos,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    onEdit,
    onDelete,
    onToggle,
    searchText
}: TodoListInfiniteProps) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    if (isLoading) {
        return (
            <div className="w-full h-full overflow-y-auto p-2">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <TodoCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (searchText && todos.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FolderCode />
                    </EmptyMedia>
                    <EmptyTitle>No Todos Found</EmptyTitle>
                    <EmptyDescription>
                        No todos found for the search term '{searchText.trim()}'.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }
    if (todos.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FolderCode />
                    </EmptyMedia>
                    <EmptyTitle>No Todos Yet</EmptyTitle>
                    <EmptyDescription>
                        You haven&apos;t created any todos yet. Get started by creating
                        your first todo.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }


    return (
        <div className="w-full h-full overflow-y-auto p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {todos.map((todo) => (
                    <TodoCard
                        key={todo.id}
                        todo={todo}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggle={onToggle}
                    />
                ))}
            </div>

            {/* Loading indicator / Intersection target */}
            <div ref={observerTarget} className="flex justify-center p-4 w-full h-10">
                {isFetchingNextPage && <Spinner className="h-6 w-6 text-primary" />}
            </div>
        </div>
    );
}
