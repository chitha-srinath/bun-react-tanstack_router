
import { useEffect, useState, useRef, useCallback } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

export function useDebouncedCallback<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
) {
    const handler = useRef<ReturnType<typeof setTimeout>>(null)
    const callbackRef = useRef<T>(callback)

    // Keep callback ref up to date to avoid stale closures if it changes
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    return useCallback((...args: Parameters<T>) => {
        if (handler.current) {
            clearTimeout(handler.current)
        }

        handler.current = setTimeout(() => {
            callbackRef.current(...args)
        }, delay)
    }, [delay])
}
