
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Todo } from "@/lib/api/todos"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TodoCardProps {
    todo: Todo
    onEdit: (todo: Todo) => void
    onDelete: (id: number) => void
    onToggle: (id: number) => void
}

export function TodoCard({ todo, onEdit, onDelete, onToggle }: TodoCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="aspect-square w-full"
        >
            <Card
                className={cn(
                    "group relative flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl",
                    todo.completed ? "bg-muted/50 opacity-80" : "bg-card",
                )}
            >
                <CardHeader className="flex-none pb-0 pt-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => onEdit(todo)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(todo.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between p-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                onClick={() => onToggle(todo.id)}
                                className={cn(
                                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer",
                                    todo.completed ? "bg-primary border-primary" : "border-muted-foreground/30",
                                )}
                            >
                                <AnimatePresence>
                                    {todo.completed && (
                                        <motion.svg
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="h-2.5 w-2.5 text-primary-foreground"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={4}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            <CardTitle
                                className={cn(
                                    "text-lg font-bold leading-tight line-clamp-2 transition-all cursor-pointer",
                                    todo.completed && "line-through text-muted-foreground",
                                )}
                                onClick={() => onToggle(todo.id)}
                            >
                                {todo.title}
                            </CardTitle>
                        </div>
                        {todo.description && <p className="text-xs text-muted-foreground line-clamp-3">{todo.description}</p>}
                    </div>

                    <div className="mt-auto pt-2">
                        {/* Removed date display as not in schema */}
                    </div>
                </CardContent>

                {todo.completed && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="absolute bottom-0 left-0 h-0.5 bg-primary/40"
                    />
                )}
            </Card>
        </motion.div>
    )
}
