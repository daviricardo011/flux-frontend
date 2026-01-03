import { ShoppingCart, CheckSquare, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { List } from "../pages/lists-page"

interface ListsGridProps {
  lists: List[]
  onSelectList: (list: List) => void
  selectedListId?: string
}

export function ListsGrid({ lists, onSelectList, selectedListId }: ListsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {lists.map((list) => {
        const isSelected = list.id === selectedListId
        const Icon = list.type === "shopping" ? ShoppingCart : CheckSquare

        return (
          <button
            key={list.id}
            onClick={() => onSelectList(list)}
            className={cn(
              "glass rounded-xl p-5 transition-all text-left glass-hover group",
              isSelected && "bg-white/10 border-[#CCFF00]/30 glow-lime",
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    list.type === "shopping" ? "bg-[#CCFF00]/10 text-[#CCFF00]" : "bg-[#8B5CF6]/10 text-[#8B5CF6]",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{list.name}</h3>
                  <p className="text-sm text-white/50">
                    {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
            </div>

            {/* Shopping Card Details */}
            {list.type === "shopping" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Estimated Total</span>
                  <span className="text-[#CCFF00] font-bold">${list.estimatedCost?.toFixed(2)}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#CCFF00] to-[#00FF66] rounded-full"
                    style={{ width: `${(list.completedCount! / list.itemCount) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Task Card Details */}
            {list.type === "task" && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="text-white/60">Pending: {list.pendingCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <span className="text-white/60">Done: {list.completedCount}</span>
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
