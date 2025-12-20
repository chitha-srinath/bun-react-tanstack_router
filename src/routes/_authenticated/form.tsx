import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from '../../hooks/use-debounce'
import { usersQueryOptions } from '@/lib/query-options'

export const Route = createFileRoute('/_authenticated/form')({
    component: RouteComponent,
})

function RouteComponent() {


    const [searchQuery, setSearchQuery] = useState('srinath')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearchQuery(value)
    }, 500)

    const { data } = useQuery(usersQueryOptions(searchQuery))



    return (
        <div>
            <input
                ref={inputRef}
                className='border border-black-300 rounded px-2 py-2 mt-2'
                defaultValue={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search first name..."
            />
            {data && (
                <div className="mt-4">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
