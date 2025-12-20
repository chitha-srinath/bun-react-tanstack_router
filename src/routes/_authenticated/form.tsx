import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from '../../hooks/use-debounce'

export const Route = createFileRoute('/_authenticated/form')({
    component: RouteComponent,
})

function RouteComponent() {
    console.log("Render")

    const [searchQuery, setSearchQuery] = useState('srinath')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearchQuery(value)
    }, 500)

    const { data } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return {
                id: 1,
                name: 'srinath',
                age: 20
            }
        },
    })

    console.log(data)

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
