import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { TodoListVirtual } from '@/components/todos/todo-list-virtual'
import { useTodosContext } from '@/components/todos/todos-context'
import { useInfiniteQuery } from '@tanstack/react-query'
import { todosQueryOptions } from '@/lib/query-options'

export const Route = createFileRoute('/_authenticated/todos/virtual')({
    component: TodosVirtual,
})

const todosRoute = getRouteApi("/_authenticated/todos");

function TodosVirtual() {
    const { search } = todosRoute.useSearch();
    const { onEdit, onDelete, onToggle } = useTodosContext();
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(todosQueryOptions({ search }));

    const todos = data?.pages.flatMap((page) => page.data.todos) ?? [];

    return (
        <TodoListVirtual
            todos={todos}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
        />

    )
}
