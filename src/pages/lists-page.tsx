"use client"

import { useState } from "react"
import { ListsGrid } from "../components/lists-grid"
import { ListDetailPanel } from "../components/list-detail-panel"
import { Sheet, SheetContent } from "../components/ui/sheet"

export type ListType = "shopping" | "task"

export interface List {
  id: string
  name: string
  type: ListType
  itemCount: number
  estimatedCost?: number
  pendingCount?: number
  completedCount?: number
}

const mockLists: List[] = [
  { id: "1", name: "Grocery", type: "shopping", itemCount: 12, estimatedCost: 450, completedCount: 0 },
  { id: "2", name: "Work Tasks", type: "task", itemCount: 8, pendingCount: 3, completedCount: 5 },
  { id: "3", name: "Home Supplies", type: "shopping", itemCount: 7, estimatedCost: 230, completedCount: 0 },
  { id: "4", name: "Personal Goals", type: "task", itemCount: 5, pendingCount: 5, completedCount: 0 },
  { id: "5", name: "Electronics", type: "shopping", itemCount: 4, estimatedCost: 1200, completedCount: 0 },
  { id: "6", name: "Fitness Plan", type: "task", itemCount: 10, pendingCount: 2, completedCount: 8 },
]

export function ListsPage() {
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false)

  const handleSelectList = (list: List) => {
    setSelectedList(list)
    setIsMobileDetailOpen(true)
  }

  const handleCloseMobileDetail = () => {
    setIsMobileDetailOpen(false)
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Desktop: Master-Detail Layout */}
      <div className="hidden lg:grid lg:grid-cols-[400px_1fr] h-full">
        {/* Left: Lists Grid */}
        <div className="border-r border-white/10 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-6">My Lists</h1>
          <ListsGrid lists={mockLists} onSelectList={setSelectedList} selectedListId={selectedList?.id} />
        </div>

        {/* Right: Detail Panel */}
        <div className="overflow-y-auto p-6">
          {selectedList ? (
            <ListDetailPanel list={selectedList} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/40 text-lg">Select a list to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Stacked View with Sheet */}
      <div className="lg:hidden h-full overflow-y-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-6">My Lists</h1>
        <ListsGrid lists={mockLists} onSelectList={handleSelectList} selectedListId={selectedList?.id} />

        {/* Mobile Sheet */}
        <Sheet open={isMobileDetailOpen} onOpenChange={setIsMobileDetailOpen}>
          <SheetContent side="bottom" className="h-[90vh] bg-[#050505] border-white/10 p-0">
            <div className="h-full overflow-y-auto p-6">
              {selectedList && <ListDetailPanel list={selectedList} onClose={handleCloseMobileDetail} />}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
