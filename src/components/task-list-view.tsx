 

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

type Priority = "high" | "medium" | "low"

interface TaskItem {
  id: string
  name: string
  priority: Priority
  completed: boolean
}

const mockTaskItems: TaskItem[] = [
  { id: "1", name: "Review Q4 financial reports", priority: "high", completed: false },
  { id: "2", name: "Update project documentation", priority: "medium", completed: false },
  { id: "3", name: "Schedule team meeting", priority: "low", completed: true },
  { id: "4", name: "Code review for new feature", priority: "high", completed: false },
  { id: "5", name: "Respond to client emails", priority: "medium", completed: true },
]

interface TaskListViewProps {
  listId: string
}

const priorityColors: Record<Priority, { dot: string; text: string }> = {
  high: { dot: "bg-red-500", text: "text-red-400" },
  medium: { dot: "bg-yellow-500", text: "text-yellow-400" },
  low: { dot: "bg-blue-500", text: "text-blue-400" },
}

export function TaskListView({ listId }: TaskListViewProps) {
  const [items, setItems] = useState<TaskItem[]>(mockTaskItems)
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium")

  const toggleTask = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteTask = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addTask = () => {
    if (!newTaskName) return

    const newTask: TaskItem = {
      id: Date.now().toString(),
      name: newTaskName,
      priority: newTaskPriority,
      completed: false,
    }

    setItems((prev) => [newTask, ...prev])
    setNewTaskName("")
    setNewTaskPriority("medium")
  }

  // Sort: incomplete tasks first, then completed tasks
  const sortedItems = [...items].sort((a, b) => {
    if (a.completed === b.completed) return 0
    return a.completed ? 1 : -1
  })

  return (
    <div className="space-y-6">
      {/* Add Task Input Bar */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Add new task..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
          <div className="flex gap-3">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button onClick={addTask} className="bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90 glow-violet">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {sortedItems.map((task) => {
          const priorityColor = priorityColors[task.priority]

          return (
            <div
              key={task.id}
              className={cn(
                "glass rounded-xl p-4 border border-white/10 glass-hover transition-all cursor-pointer flex items-center gap-4",
                task.completed && "opacity-50",
              )}
              onClick={() => toggleTask(task.id)}
            >
              {/* Checkbox */}
              <button
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
                  task.completed ? "bg-[#8B5CF6] border-[#8B5CF6]" : "border-white/30",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTask(task.id)
                }}
              >
                {task.completed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Priority Dot */}
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityColor.dot)} />

              {/* Task Name */}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium text-white", task.completed && "line-through")}>{task.name}</p>
              </div>

              {/* Priority Label */}
              <div
                className={cn("px-3 py-1 rounded-full bg-white/5 text-xs font-medium capitalize", priorityColor.text)}
              >
                {task.priority}
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteTask(task.id)
                }}
                className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
