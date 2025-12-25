import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/Label"

import { useForm } from "@tanstack/react-form"
import type { Todo } from "@/lib/api/todos"

interface TodoSheetProps {
    isOpen: boolean
    onClose: () => void
    onSave: (todo: Partial<Todo>) => Promise<void>
    todo?: Todo | null
}

export function TodoSheet({ isOpen, onClose, onSave, todo }: TodoSheetProps) {
    const form = useForm({
        defaultValues: {
            title: todo?.title || "",
            description: todo?.description || "",
        },
        onSubmit: async ({ value }) => {
            await onSave(value)
            onClose()
            form.reset()
        },
    })

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    onClose()
                    form.reset()
                }
            }}
        >
            <SheetContent className="sm:max-w-[350px]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="flex flex-col h-full"
                >
                    <SheetHeader className="pb-6">
                        <SheetTitle>{todo ? "Edit Task" : "Create New Task"}</SheetTitle>
                        <SheetDescription>
                            {todo ? "Update the details of your task here." : "Fill in the details to add a new task to your list."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-2 flex flex-col gap-4 flex-1">
                        <form.Field name="title">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name} className="text-sm font-semibold">
                                        Title
                                    </Label>
                                    <Input
                                        id={field.name}
                                        placeholder="What needs to be done?"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        required
                                        className="focus-visible:ring-primary"
                                    />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="description">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name} className="text-sm font-semibold">
                                        Description
                                    </Label>
                                    <Textarea
                                        id={field.name}
                                        placeholder="Add more context..."
                                        value={field.state.value} // ensure value handles undefined/null if needed, form state usually string
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="min-h-[120px] resize-none focus-visible:ring-primary"
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <SheetFooter className="pt-6 border-t mt-auto">
                        <form.Subscribe selector={(state) => [state.isSubmitting]}>
                            {([isSubmitting]) => (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            onClose()
                                            form.reset()
                                        }}
                                        className="w-full sm:w-auto bg-transparent"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto px-8" disabled={isSubmitting}>
                                        {isSubmitting ? "Saving..." : todo ? "Update Task" : "Create Task"}
                                    </Button>
                                </>
                            )}
                        </form.Subscribe>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
