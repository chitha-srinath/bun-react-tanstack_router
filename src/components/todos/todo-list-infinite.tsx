import { useEffect, useRef } from "react";
import { type Todo } from "@/lib/api/todos";
import { TodoCard } from "./todo-card";
import { Spinner } from "@/components/ui/Spinner";

interface TodoListInfiniteProps {
    todos: Todo[];
    isLoading: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string, newStatus: boolean) => void;
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

    if (isLoading && todos.length === 0) {
        return <div className="text-center py-10">Loading first batch...</div>;
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
