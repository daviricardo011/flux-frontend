import { useState } from "react"
import { Flame, Droplet, Book, Dumbbell, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const initialHabits = [
  { id: 1, name: "Morning Meditation", time: "6:00 AM", streak: 24, icon: Flame, completed: false, xp: 50 },
  {
    id: 2,
    name: "Drink 8 Glasses of Water",
    time: "Throughout day",
    streak: 30,
    icon: Droplet,
    completed: false,
    xp: 40,
  },
  { id: 3, name: "Read for 30 Minutes", time: "8:00 PM", streak: 12, icon: Book, completed: false, xp: 60 },
  { id: 4, name: "Evening Workout", time: "5:30 PM", streak: 18, icon: Dumbbell, completed: true, xp: 75 },
  { id: 5, name: "Morning Sunlight", time: "7:00 AM", streak: 15, icon: Sun, completed: false, xp: 30 },
  { id: 6, name: "Sleep by 10 PM", time: "10:00 PM", streak: 22, icon: Moon, completed: false, xp: 45 },
]

export function HabitsInteractiveList() {
  const [habits, setHabits] = useState(initialHabits)

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              streak: !habit.completed ? habit.streak + 1 : habit.streak,
            }
          : habit,
      ),
    )
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Today's Habits</h2>
        <p className="text-sm text-white/60">
          {habits.filter((h) => h.completed).length} of {habits.length} completed
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {habits.map((habit) => {
            const Icon = habit.icon
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer",
                  "glass-hover border border-white/10",
                  habit.completed && "bg-[#8B5CF6]/10 border-[#8B5CF6]/30",
                )}
                onClick={() => toggleHabit(habit.id)}
              >
                {/* Left: Habit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Icon
                      className={cn("w-5 h-5 flex-shrink-0", habit.completed ? "text-[#8B5CF6]" : "text-white/70")}
                    />
                    <h3
                      className={cn(
                        "font-medium transition-all",
                        habit.completed ? "text-white/60 line-through" : "text-white",
                      )}
                    >
                      {habit.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/50 ml-8">
                    <span>{habit.time}</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {habit.streak} day streak
                    </span>
                    <span className="text-[#8B5CF6]">+{habit.xp} XP</span>
                  </div>
                </div>

                {/* Right: Specialized Checkbox */}
                <motion.div
                  className={cn(
                    "relative w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    habit.completed
                      ? "bg-[#8B5CF6] border-[#8B5CF6] glow-violet"
                      : "border-white/30 hover:border-[#8B5CF6]/50",
                  )}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    habit.completed
                      ? {
                          boxShadow: [
                            "0 0 20px rgba(139, 92, 246, 0.5)",
                            "0 0 30px rgba(139, 92, 246, 0.7)",
                            "0 0 20px rgba(139, 92, 246, 0.5)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <AnimatePresence>
                    {habit.completed && (
                      <motion.svg
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-6 h-6 md:w-7 md:h-7 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
