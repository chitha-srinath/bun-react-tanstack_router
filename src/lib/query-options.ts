import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "./constants";

import { fetchTodos } from "./api/todos";

export const todosQueryOptions = (options: { search?: string }) => infiniteQueryOptions({
    queryKey: [QUERY_KEYS.todos, options.search],
    queryFn: ({ pageParam }) => fetchTodos({ ...options, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
        const { page, total, limit } = lastPage.data.pagination;
        const totalPages = Math.ceil(total / limit);
        return page < totalPages ? page + 1 : undefined;
    },
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
