import { queryOptions } from "@tanstack/react-query";
import api from "./api";
import { QUERY_KEYS } from "./constants";

export const todosQueryOptions = queryOptions({
    queryKey: [QUERY_KEYS.todos],
    queryFn: async () => {
        const response = await api.get("/posts");
        const result = response.data;

        if (result.error) {
            throw new Error(result.message);
        }

        return result.data || [];
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
