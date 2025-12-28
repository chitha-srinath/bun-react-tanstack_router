import { createContext, useContext } from "react";
import { type Todo } from "@/lib/api/todos";

export type TodosContextType = {
    search: string;
    setSearch: (query: string) => void;
    filter: { status?: string, date?: string };
    setFilter: (filter: { status?: string, date?: string }) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string, newStatus: boolean) => void;
};

const TodosContext = createContext<TodosContextType | null>(null);

export const useTodosContext = () => {
    const context = useContext(TodosContext);
    if (!context) {
        throw new Error("useTodosContext must be used within a TodosLayout");
    }
    return context;
};

export const TodosProvider = TodosContext.Provider;
