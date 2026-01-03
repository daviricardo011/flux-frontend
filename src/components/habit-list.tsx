"use client"

import { useState } from "react"
import { Flame, Droplet, Book, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

const habits = [
  { id: 1, name: "Morning Meditation", streak: 12, icon: Flame, completed: false },
  { id: 2, name: "Drink Water", streak: 25, icon: Droplet, completed: true },
  { id: 3, name: "Read 30 min", streak: 8, icon: Book, completed: false },
  { id: 4, name: "Workout", streak: 15, icon: Dumbbell, completed: true },
]

export function HabitList() {
  const [habitStates, setHabitStates] = useState(habits)

  const toggleHabit = (id: number) => {
    setHabitStates((prev) => prev.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit)))
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <h3 className="text-xl font-bold text-white mb-4">Active Habits</h3>

      <div className="space-y-3">
        {habitStates.map((habit) => {
          const Icon = habit.icon
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300",
                "glass-hover",
                habit.completed && "glow-violet bg-[#8B5CF6]/10",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
                  habit.completed ? "bg-[#8B5CF6] border-[#8B5CF6]" : "border-white/30",
                )}
              >
                {habit.completed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="flex-1 text-left">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    habit.completed ? "text-[#8B5CF6]" : "text-white",
                  )}
                >
                  {habit.name}
                </p>
                <p className="text-xs text-white/50">{habit.streak} day streak 🔥</p>
              </div>

              <Icon className={cn("w-5 h-5 transition-colors", habit.completed ? "text-[#8B5CF6]" : "text-white/50")} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
