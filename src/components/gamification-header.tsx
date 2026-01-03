"use client"
import { Flame, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function GamificationHeader() {
  const level = 12
  const currentXP = 3450
  const nextLevelXP = 5000
  const xpProgress = (currentXP / nextLevelXP) * 100
  const currentStreak = 24

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Top Row: Level and Streak */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Level Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center glow-violet">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Your Level</p>
              <h2 className="text-2xl font-bold text-white">Level {level}</h2>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>{currentXP.toLocaleString()} XP</span>
              <span>{nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full glow-violet"
              />
            </div>
            <p className="text-xs text-white/50 text-right">
              {(nextLevelXP - currentXP).toLocaleString()} XP to next level
            </p>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex-shrink-0 md:w-64">
          <div className="glass-hover rounded-xl p-4 border border-white/10 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Current Streak</p>
                <h3 className="text-3xl font-bold text-[#8B5CF6]">{currentStreak}</h3>
                <p className="text-xs text-white/50 mt-1">days in a row</p>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Flame className="w-12 h-12 text-[#FF6B6B]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
