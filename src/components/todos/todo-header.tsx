import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useDebouncedCallback } from "@/hooks/use-debounce"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { TodoFilters } from "./todo-filters"
import { useTodosContext } from "./todos-context"

interface TodoHeaderProps {
    onCreate: () => void
}

export function TodoHeader({
    onCreate
}: TodoHeaderProps) {
    const { search, setSearch } = useTodosContext()
    const [localSearch, setLocalSearch] = useState(search)

    const debouncedSetSearch = useDebouncedCallback((value: string) => {
        setSearch(value)
    }, 300)

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setLocalSearch(value)
        debouncedSetSearch(value)
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">


            <div className="flex items-center gap-2">

                <Button onClick={onCreate} size="sm" className="flex-shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
                <div className="flex-1 w-full md:max-w-md">
                    <div className="relative">
                        <Input
                            placeholder="Search todos..."
                            value={localSearch}
                            onChange={handleSearch}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-gray-300 focus-visible:ring-offset-0 pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

            </div>

            <TodoFilters />

        </div>
    )
}
