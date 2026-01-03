"use client"
import { X } from "lucide-react"
import { ShoppingListView } from "./shopping-list-view"
import { TaskListView } from "./task-list-view"
import type { List } from "../pages/lists-page"

interface ListDetailPanelProps {
  list: List
  onClose?: () => void
}

export function ListDetailPanel({ list, onClose }: ListDetailPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{list.name}</h2>
          <p className="text-white/60 mt-1">
            {list.type === "shopping" ? "Shopping List" : "Task List"} • {list.itemCount}{" "}
            {list.itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-10 h-10 rounded-lg glass glass-hover flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        )}
      </div>

      {/* List Content */}
      {list.type === "shopping" ? <ShoppingListView listId={list.id} /> : <TaskListView listId={list.id} />}
    </div>
  )
}
