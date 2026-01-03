export function HabitScore() {
  const score = 78
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full flex flex-col">
      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">Habit Score</p>
        <h3 className="text-3xl font-bold text-white">{score}%</h3>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#8B5CF6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#8B5CF6]">{score}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/40 text-center">Weekly average</p>
    </div>
  )
}
