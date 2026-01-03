"use client"

import { Trophy, Target, Flame, Star, Award, Zap, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const achievements = [
  { id: 1, name: "First Step", description: "Complete your first habit", icon: Target, unlocked: true },
  { id: 2, name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, unlocked: true },
  { id: 3, name: "Consistency King", description: "Complete 30 habits", icon: Star, unlocked: true },
  { id: 4, name: "First Month", description: "Maintain a 30-day streak", icon: Award, unlocked: false },
  { id: 5, name: "Level 10", description: "Reach level 10", icon: Zap, unlocked: true },
  { id: 6, name: "Perfect Week", description: "Complete all habits for 7 days", icon: Trophy, unlocked: false },
]

export function AchievementsSection() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Trophy Case</h2>
        <p className="text-sm text-white/60">
          {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative glass-hover rounded-xl p-4 border transition-all cursor-pointer",
                achievement.unlocked
                  ? "border-[#FFD700]/50 bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5"
                  : "border-white/10 bg-white/5 opacity-60",
              )}
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div
                  className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center relative",
                    achievement.unlocked ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500]" : "bg-white/10",
                  )}
                  style={
                    achievement.unlocked
                      ? {
                          boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
                        }
                      : {}
                  }
                >
                  {achievement.unlocked ? (
                    <Icon className="w-8 h-8 text-black" />
                  ) : (
                    <>
                      <Icon className="w-8 h-8 text-white/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white/50" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className={cn("text-sm font-bold mb-1", achievement.unlocked ? "text-[#FFD700]" : "text-white/50")}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-white/40 line-clamp-2">{achievement.description}</p>
              </div>

              {/* Shine Effect for Unlocked */}
              {achievement.unlocked && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 5,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
