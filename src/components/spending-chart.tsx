"use client"

export function SpendingChart() {
  const data = [45, 52, 38, 65, 48, 72, 58, 85, 65, 78, 92, 88]
  const max = Math.max(...data)

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">Monthly Spending</p>
        <h3 className="text-3xl font-bold text-white">$1,847</h3>
      </div>

      <div className="flex items-end gap-1 h-24">
        {data.map((value, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-[#CCFF00] to-[#CCFF00]/50 rounded-t transition-all hover:opacity-80"
            style={{ height: `${(value / max) * 100}%` }}
          />
        ))}
      </div>

      <p className="text-xs text-white/40 mt-3">Last 12 months</p>
    </div>
  )
}
