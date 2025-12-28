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
export const fetchTodos = async ({ page = 1, limit = 20, skip = 0, search, filter }: { page?: number, limit?: number, skip?: number, search?: string, filter?: { status?: string, date?: string } }): Promise<GetTodosResponse> => {
    const payload = {
        page,
        limit,
        skip,
        ...(search && { search }),
        // ...(filter && { filter })
    };

    const response = await api.post("/todos/get-todos", payload);
    return response.data;
};

export interface CreateTodoInput {
    title: string;
    description?: string;
}

export const createTodo = async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await api.post("/todos", todo);
    const result = response.data;
    if (result.error) throw new Error(result.message);
    return result.data;
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, updates);
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
    const response = await api.put(`/todos/${id}`, { completed });
    const result = response.data;
    if (result.error) throw new Error(result.message);
    return result.data;
};
