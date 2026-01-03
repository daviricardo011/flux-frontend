"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

export function TransactionFab() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"income" | "expense">("expense")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 w-16 h-16 rounded-full bg-[#CCFF00] hover:bg-[#CCFF00]/90 flex items-center justify-center shadow-lg glow-lime transition-all hover:scale-110 z-40">
          <Plus className="w-7 h-7 text-black" />
        </button>
      </DialogTrigger>

      <DialogContent className="glass border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
            New Transaction
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg glass-hover flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Type Toggle */}
          <div className="space-y-2">
            <Label className="text-white/80">Type</Label>
            <div className="glass rounded-xl p-1 flex gap-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={cn(
                  "flex-1 py-2 rounded-lg font-medium transition-all",
                  type === "expense" ? "bg-white text-black" : "text-white/70 hover:text-white",
                )}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={cn(
                  "flex-1 py-2 rounded-lg font-medium transition-all",
                  type === "income" ? "bg-[#00FF66] text-black" : "text-white/70 hover:text-white",
                )}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white/80">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8 glass border-white/20 text-white text-lg h-12 rounded-xl focus:border-[#CCFF00] focus:ring-[#CCFF00]"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/80">
              Category
            </Label>
            <Select>
              <SelectTrigger className="glass border-white/20 text-white h-12 rounded-xl focus:border-[#CCFF00] focus:ring-[#CCFF00]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20 bg-[#050505]">
                {type === "expense" ? (
                  <>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/80">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter description"
              className="glass border-white/20 text-white h-12 rounded-xl focus:border-[#CCFF00] focus:ring-[#CCFF00]"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-bold h-12 rounded-xl glow-lime"
          >
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
