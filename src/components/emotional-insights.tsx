import { useState } from "react"
import { Heart, Smile, Zap, Coffee, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const emotions = [
  { id: "joy", label: "Joy", icon: "😊", color: "#FFD700" },
  { id: "stress", label: "Stress", icon: "😰", color: "#FF6B6B" },
  { id: "boredom", label: "Boredom", icon: "😑", color: "#95A5A6" },
  { id: "excited", label: "Excited", icon: "🤩", color: "#8B5CF6" },
  { id: "anxious", label: "Anxious", icon: "😟", color: "#F59E0B" },
]

const insights = [
  {
    emotion: "anxious",
    percentage: 20,
    description: "You spend 20% more when Anxious",
    icon: TrendingUp,
    color: "#F59E0B",
  },
  {
    emotion: "boredom",
    percentage: 15,
    description: "Boredom triggers 15% more impulse purchases",
    icon: Coffee,
    color: "#95A5A6",
  },
  {
    emotion: "excited",
    percentage: 25,
    description: "Excitement leads to 25% higher spending",
    icon: Zap,
    color: "#8B5CF6",
  },
]

export function EmotionalInsights() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-[#CCFF00]" />
          <h2 className="text-xl font-bold text-white">Emotional Spending</h2>
        </div>
        <p className="text-sm text-white/50">Track how emotions affect your purchases</p>
      </div>

      {/* Emotion Selector */}
      <div className="mb-6">
        <p className="text-sm text-white/70 mb-3">How did you feel during your last purchase?</p>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion.id}
              onClick={() => setSelectedEmotion(emotion.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-4 py-3 rounded-xl border transition-all
                ${
                  selectedEmotion === emotion.id
                    ? "border-[#CCFF00] bg-[#CCFF00]/10 shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                    : "border-white/10 glass-hover"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{emotion.icon}</span>
                <span className="text-sm font-medium text-white">{emotion.label}</span>
              </div>
              {selectedEmotion === emotion.id && (
                <motion.div
                  layoutId="glow"
                  className="absolute inset-0 rounded-xl bg-[#CCFF00]/5 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-white/70 mb-2">Your Spending Patterns</p>
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.emotion} className="glass rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${insight.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${insight.percentage}%`,
                          backgroundColor: insight.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white">{insight.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="glass rounded-xl p-4 border border-[#CCFF00]/20 bg-[#CCFF00]/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/20 flex items-center justify-center flex-shrink-0">
              <Smile className="w-4 h-4 text-[#CCFF00]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">Pro Tip</p>
              <p className="text-xs text-white/70">
                Wait 24 hours before making purchases when feeling stressed or anxious to reduce impulse spending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
