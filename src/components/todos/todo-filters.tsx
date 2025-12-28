import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useForm } from "@tanstack/react-form"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Filter } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { useTodosContext } from "./todos-context"

import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const filterSchema = z.object({
    status: z.enum(["all", "completed", "pending"]),
    date: z.string().optional(),
})

type FilterValues = z.infer<typeof filterSchema>

// interface TodoFiltersProps {
//     filter?: { status?: string, date?: string }
//     setFilter?: (filter: { status?: string, date?: string }) => void
// }

export function TodoFilters() {
    const { filter, setFilter } = useTodosContext()
    const [open, setOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const form = useForm({
        defaultValues: {
            status: (filter?.status as "all" | "completed" | "pending") || "all",
            date: filter?.date || "",
        } as FilterValues,

        validators: {
            onChange: filterSchema,
        },
        onSubmit: async ({ value }) => {
            console.log("Filters applied:", value)
            setFilter(value)
            setOpen(false)
        },
    })

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </SheetTrigger>
            <SheetContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="flex flex-col h-full"
                >

                    <SheetHeader className="pb-6">
                        <SheetTitle>Filter Todos</SheetTitle>
                        <SheetDescription>
                            Narrow down your todo list using the filters below.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 flex flex-col gap-4 flex-1">
                        <form.Field
                            name="status"
                            children={(field) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="status">
                                        Status
                                    </Label>
                                    <select
                                        id="status"
                                        value={field.state.value}
                                        onChange={(e) =>
                                            field.handleChange(
                                                e.target.value as "all" | "completed" | "pending",
                                            )
                                        }
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="all">All</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            )}
                        />

                        <form.Field
                            name="date"
                            children={(field) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="date">Created On</Label>
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.state.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.state.value ? (
                                                    format(new Date(field.state.value), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                {/* <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.state.value ? new Date(field.state.value) : undefined}
                                                onSelect={(d) => {
                                                    field.handleChange(d ? format(d, "yyyy-MM-dd") : "")
                                                    setIsCalendarOpen(false)
                                                }}
                                                initialFocus
                                                captionLayout="dropdown"
                                                fromYear={2020}
                                                toYear={new Date().getFullYear()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        />

                    </div>
                    <SheetFooter className="pt-6 border-t mt-auto">
                        <form.Subscribe
                            selector={(state) => ({
                                canSubmit: state.canSubmit,
                                isSubmitting: state.isSubmitting,
                            })}
                        >
                            {({ canSubmit, isSubmitting }) => (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setOpen(false)
                                            form.reset()
                                        }}
                                        className="w-full sm:w-auto bg-transparent"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto px-8"
                                        disabled={!canSubmit}
                                    >
                                        {isSubmitting ? "Applying..." : "Apply"}
                                    </Button>
                                </>
                            )}
                        </form.Subscribe>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet >
    )
}
