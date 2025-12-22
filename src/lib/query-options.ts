import { queryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "./constants";

import { fetchTodos } from "./api/todos";

export const todosQueryOptions = queryOptions({
    queryKey: [QUERY_KEYS.todos],
    queryFn: async () => {
        // Since fetchTodos is now designed for infinite query/pagination,
        // we might pass checking of array wrapped in object or regular array.
        // For consistent simple query usage, we can just call it and return data.
        const response = await fetchTodos({});
        // fetchTodos returns { todos, nextCursor } now or just data.
        // We'll normalize it for this simple query if needed, 
        // but given useInfiniteQuery usage elsewhere, let's keep it simple here 
        // by handling the response structure.
        return response.data.todos;
    },
    initialData: [],
});

export const usersQueryOptions = (searchQuery: string) => queryOptions({
    queryKey: [QUERY_KEYS.users, searchQuery],
    queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
            id: 1,
            name: 'srinath',
            age: 20
        }
    },
})
