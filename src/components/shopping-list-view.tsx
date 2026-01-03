import { useState } from "react"
import { Plus, Trash2, ShoppingBag, Apple, Beef, Milk } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface ShoppingItem {
  id: string
  name: string
  price: number
  quantity: number
  checked: boolean
  icon: typeof ShoppingBag
}

const mockShoppingItems: ShoppingItem[] = [
  { id: "1", name: "Organic Apples", price: 4.99, quantity: 2, checked: false, icon: Apple },
  { id: "2", name: "Whole Milk", price: 3.49, quantity: 1, checked: false, icon: Milk },
  { id: "3", name: "Ground Beef", price: 12.99, quantity: 1, checked: true, icon: Beef },
  { id: "4", name: "Bananas", price: 2.99, quantity: 3, checked: false, icon: Apple },
  { id: "5", name: "Greek Yogurt", price: 5.99, quantity: 2, checked: false, icon: Milk },
]

interface ShoppingListViewProps {
  listId: string
}

export function ShoppingListView({ listId }: ShoppingListViewProps) {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingItems)
  const [newItemName, setNewItemName] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [newItemQty, setNewItemQty] = useState("1")
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSwipedItemId(null)
  }

  const addItem = () => {
    if (!newItemName || !newItemPrice) return

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: Number.parseFloat(newItemPrice),
      quantity: Number.parseInt(newItemQty) || 1,
      checked: false,
      icon: ShoppingBag,
    }

    setItems((prev) => [newItem, ...prev])
    setNewItemName("")
    setNewItemPrice("")
    setNewItemQty("1")
  }

  const totalEstimated = items
    .filter((item) => !item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalInCart = items.filter((item) => item.checked).reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Add Item Input Bar */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Add item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Price"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-24 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <Input
              type="number"
              placeholder="Qty"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              className="w-20 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <Button onClick={addItem} className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90 glow-lime">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isSwiped = swipedItemId === item.id

          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl"
              onTouchStart={() => setSwipedItemId(null)}
            >
              {/* Delete Background (shown on swipe) */}
              <div
                className={cn(
                  "absolute inset-0 bg-red-500/20 flex items-center justify-end px-6 transition-opacity",
                  isSwiped ? "opacity-100" : "opacity-0",
                )}
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              {/* Item Row */}
              <div
                className={cn(
                  "relative glass p-4 border border-white/10 glass-hover transition-all cursor-pointer flex items-center gap-4",
                  item.checked && "opacity-60",
                )}
                onClick={() => toggleItem(item.id)}
              >
                {/* Checkbox */}
                <button
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
                    item.checked ? "bg-[#CCFF00] border-[#CCFF00]" : "border-white/30",
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleItem(item.id)
                  }}
                >
                  {item.checked && (
                    <svg
                      className="w-4 h-4 text-black"
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

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#CCFF00]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#CCFF00]" />
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium text-white", item.checked && "line-through")}>{item.name}</p>
                </div>

                {/* Quantity Badge */}
                <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/70">
                  x{item.quantity}
                </div>

                {/* Price */}
                <div className="text-[#00FF66] font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</div>

                {/* Mobile Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteItem(item.id)
                  }}
                  className="lg:hidden w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 left-0 right-0 glass rounded-xl p-6 border border-white/10 backdrop-blur-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-white/60 mb-1">Total Estimated</p>
            <p className="text-2xl font-bold text-white">${totalEstimated.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-white/60 mb-1">Total in Cart</p>
            <p className="text-2xl font-bold text-[#CCFF00]">${totalInCart.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
