import api from "../api";

export interface User {
    id: string;
    email?: string;
    name?: string;
}

export interface Todo {
    id: string;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    userId: string;
    user?: User;
}

export interface GetTodosResponse {
    error: boolean;
    message: string;
    data: {
        todos: Todo[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            skip: number;
        };
    };
}

// Support for infinite query pagination
export const fetchTodos = async ({ pageParam = 1 }: { pageParam?: number }): Promise<GetTodosResponse> => {
    // API requires page, limit, skip. We'll default limit to 20.
    // Assuming pageParam starts at 1.
    const payload = {
        page: pageParam,
        limit: 20,
        skip: 0 // Optional or calculated if needed, but usually page/limit is enough for page-based
    };

    const response = await api.post("/todos/get-todos", payload);
    return response.data;
};

export const createTodo = async (todo: Partial<Todo>): Promise<Todo> => {
    const response = await api.post("/todos", todo); // Assuming create is still /todos or /todos/create? Keeping generic for now as user only specified get-todos
    // If the create endpoint also changed, we might need info on that. detailed in previous files it was /posts.
    // The user context implies a migration from "Post" schema to "Todo".
    // I will assume standard CRUD endpoints for now but keep 'posts' if strictly following old file, 
    // BUT the user request showed URL `/api/todos/get-todos`. 
    // It's safer to assume the base resource is now `/todos`.
    const result = response.data;
    if (result.error) throw new Error(result.message);
    return result.data;
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, updates);
    const result = response.data;
    if (result.error) throw new Error(result.message);
    return result.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
    const response = await api.delete(`/todos/${id}`);
    const result = response.data;
    if (result.error) throw new Error(result.message);
};

export const toggleTodo = async ({ id, completed }: { id: string; completed: boolean }): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, { completed });
    const result = response.data;
    if (result.error) throw new Error(result.message);
    return result.data;
};
