"use client"

import { useState, useEffect, useRef, type KeyboardEvent, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Edit2,
  Save,
  Trash2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  SortAsc,
  SortDesc,
  X,
  Info,
  Filter,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/app/components/LoadingSpinner"

interface Task {
  id: string
  title: string
  status: "pending" | "in_progress" | "completed"
}

interface TaskTableProps {
  tasks: Task[]
  isLoading?: boolean
  onUpdateTask: (task: { id: string; title: string; status: "pending" | "in_progress" | "completed" }) => void
  onUpdateStatus: (task: { id: string; status: "pending" | "in_progress" | "completed" }) => void
  onDelete: (taskId: string) => void
}

export function TaskTable({ tasks, isLoading = false, onUpdateTask, onUpdateStatus, onDelete }: TaskTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add loading states for individual operations
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  // Add this computed value
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Apply sorting
    return result.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.title.localeCompare(b.title)
      } else {
        return b.title.localeCompare(a.title)
      }
    })
  }, [tasks, searchTerm, sortDirection, statusFilter])

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus()
    }, 10)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const saveEditing = async (taskId: string) => {
    if (editTitle.trim()) {
      setUpdatingTaskId(taskId)
      try {
        await onUpdateTask({ id: taskId, title: editTitle, status: "pending" })
      } finally {
        setUpdatingTaskId(null)
        setEditingId(null)
      }
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: "pending" | "in_progress" | "completed") => {
    setUpdatingStatusId(taskId)
    try {
      await onUpdateStatus({ id: taskId, status: newStatus })
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleDelete = async (taskId: string) => {
    setDeletingTaskId(taskId)
    try {
      await onDelete(taskId)
    } finally {
      setDeletingTaskId(null)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, taskId: string) => {
    if (e.key === "Enter") {
      saveEditing(taskId)
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <RotateCcw className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  {statusFilter && (
                    <Badge variant="secondary" className="ml-1">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setStatusFilter("pending")}
                  className={statusFilter === "pending" ? "bg-muted" : ""}
                >
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("in_progress")}
                  className={statusFilter === "in_progress" ? "bg-muted" : ""}
                >
                  <RotateCcw className="h-4 w-4 text-blue-500 mr-2" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("completed")}
                  className={statusFilter === "completed" ? "bg-muted" : ""}
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>Show All</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleSort}>
                  {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sortDirection === "asc" ? "Sort Z to A" : "Sort A to Z"}</TooltipContent>
            </Tooltip>

            {(searchTerm || statusFilter) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove all filters</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="rounded-md border shadow-sm overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50%] font-semibold">Task</TableHead>
                <TableHead className="w-[25%] font-semibold">Status</TableHead>
                <TableHead className="w-[25%] text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <LoadingSpinner size={16} />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Info className="h-10 w-10 mb-2 opacity-20" />
                      {tasks.length === 0 ? (
                        <p>No tasks found. Create your first task to get started.</p>
                      ) : (
                        <p>No tasks match your current filters.</p>
                      )}
                      {(searchTerm || statusFilter) && (
                        <Button variant="link" onClick={clearFilters} className="mt-2">
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTasks.map((task) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className={`group border-b hover:bg-muted/30 ${editingId === task.id ? "bg-muted/40" : ""}`}
                  >
                    <TableCell className="py-3">
                      {editingId === task.id ? (
                        <div className="relative">
                          <Input
                            ref={inputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, task.id)}
                            className="w-full pr-20"
                            autoFocus
                          />
                          <div className="absolute right-1 top-1 flex gap-1">
                            <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-7 w-7 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveEditing(task.id)}
                              className="h-7 w-7 p-0"
                              disabled={updatingTaskId === task.id}
                            >
                              {updatingTaskId === task.id ? (
                                <LoadingSpinner size={16} />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`cursor-pointer rounded px-2 py-1 -mx-2 -my-1 transition-colors ${task.status === "completed" ? "line-through text-muted-foreground" : ""
                            }`}
                          onClick={() => startEditing(task)}
                        >
                          {task.title}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) =>
                          handleStatusChange(task.id, value as "pending" | "in_progress" | "completed")
                        }
                        disabled={updatingStatusId === task.id}
                      >
                        <SelectTrigger className={`w-[140px] ${getStatusColor(task.status)}`}>
                          {updatingStatusId === task.id ? (
                            <div className="flex items-center">
                              <LoadingSpinner size={16} className="mr-2" />
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <SelectValue>
                              <div className="flex items-center">
                                {getStatusIcon(task.status)}
                                <span className="ml-2 capitalize">
                                  {task.status.replace("_", " ")}
                                </span>
                              </div>
                            </SelectValue>
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                              <span>Pending</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <div className="flex items-center">
                              <RotateCcw className="h-4 w-4 text-blue-500 mr-2" />
                              <span>In Progress</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span>Completed</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => startEditing(task)}
                          disabled={editingId === task.id || updatingTaskId === task.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              disabled={deletingTaskId === task.id}
                            >
                              {deletingTaskId === task.id ? (
                                <LoadingSpinner size={16} />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this task? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(task.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}

