import { TodoListInfinite } from '@/components/todos/todo-list-infinite'
import { useTodosContext } from '@/components/todos/todos-context'
import { todosQueryOptions } from '@/lib/query-options'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/todos/')({
    component: TodosIndex,
})

const todosRoute = getRouteApi("/_authenticated/todos");

function TodosIndex() {
    const { search } = todosRoute.useSearch();
    const { onEdit, onDelete, onToggle } = useTodosContext();
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(todosQueryOptions({ search }));

    const todos = data?.pages.flatMap((page) => page.data.todos) ?? [];

    return (
        <TodoListInfinite
            todos={todos}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            searchText={search ?? ""}
        />
    )
}
