import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect, useState } from "react";
import { type Todo } from "@/lib/api/todos";
import { TodoCard } from "./todo-card";
import { Spinner } from "@/components/ui/Spinner";

interface TodoListVirtualProps {
    todos: Todo[];
    isLoading: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string, newStatus: boolean) => void;
}

export function TodoListVirtual({
    todos,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    onEdit,
    onDelete,
    onToggle,
}: TodoListVirtualProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const getColumns = () => {
        if (typeof window !== "undefined") {
            if (window.innerWidth >= 1024) return 4; // lg
            if (window.innerWidth >= 768) return 3;  // md
            return 2; // base
        }
        return 1;
    };

    const [columns, setColumns] = useState(getColumns);

    // Sync columns with window resize to match Tailwind grid classes
    useEffect(() => {
        const handleResize = () => {
            setColumns(getColumns());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const rows = Math.ceil(todos.length / columns);

    const rowVirtualizer = useVirtualizer({
        count: rows,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 300, // Estimate height of a card row
        overscan: 5, // Pre-render 5 rows
    });

    // Infinite scroll logic
    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

        if (!lastItem) {
            return;
        }

        if (
            lastItem.index >= rows - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [
        hasNextPage,
        fetchNextPage,
        todos.length,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
        rows,
    ]);

    if (isLoading && todos.length === 0) {
        return <div className="text-center py-10">Loading first batch...</div>;
    }

    return (
        <div
            ref={parentRef}
            className="h-full w-full overflow-y-auto contain-strict scroll-smooth p-2"
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIndex = virtualRow.index * columns;
                    const rowTodos = todos.slice(startIndex, startIndex + columns);

                    return (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4"
                        >
                            {rowTodos.map((todo) => (
                                <TodoCard
                                    key={todo.id}
                                    todo={todo}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggle={onToggle}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
            {isFetchingNextPage && (
                <div className="flex justify-center p-4 w-full">
                    <Spinner className="h-6 w-6 text-primary" />
                </div>
            )}
        </div>
    );
}
