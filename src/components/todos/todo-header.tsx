import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Plus, Search } from "lucide-react"
import { useDebouncedCallback } from "@/hooks/use-debounce"

interface TodoHeaderProps {
    title?: string
    searchQuery: string
    setSearchQuery: (query: string) => void
    onCreate: () => void
}

export function TodoHeader({
    title = "Todo List",
    searchQuery,
    setSearchQuery,
    onCreate
}: TodoHeaderProps) {
    const [localSearch, setLocalSearch] = useState(searchQuery)

    const debouncedSetSearch = useDebouncedCallback((value: string) => {
        setSearchQuery(value)
    }, 300)

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setLocalSearch(value)
        debouncedSetSearch(value)
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-center md:text-left flex-shrink-0">
                {title}
            </h1>

            <div className="flex-1 w-full md:max-w-md px-4">
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

            <Button onClick={onCreate} size="sm" className="flex-shrink-0">
                <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
        </div>
    )
}
