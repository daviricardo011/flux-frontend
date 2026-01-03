import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import { TrendingDown, AlertTriangle } from "lucide-react"

// Historical spending data (past 15 days of current month)
const historicalData = [
  { day: 1, spending: 120 },
  { day: 2, spending: 245 },
  { day: 3, spending: 380 },
  { day: 4, spending: 495 },
  { day: 5, spending: 640 },
  { day: 6, spending: 755 },
  { day: 7, spending: 890 },
  { day: 8, spending: 1020 },
  { day: 9, spending: 1145 },
  { day: 10, spending: 1280 },
  { day: 11, spending: 1390 },
  { day: 12, spending: 1520 },
  { day: 13, spending: 1640 },
  { day: 14, spending: 1775 },
  { day: 15, spending: 1890 },
]

// Calculate daily burn rate (average spending per day)
const currentDay = 15
const currentSpending = 1890
const dailyBurnRate = currentSpending / currentDay // ~126/day

// Project to end of month (day 30)
const forecastData = []
for (let day = currentDay + 1; day <= 30; day++) {
  forecastData.push({
    day,
    forecast: currentSpending + dailyBurnRate * (day - currentDay),
  })
}

// Combine data
const chartData = [
  ...historicalData.map((d) => ({ ...d, forecast: null })),
  ...forecastData.map((d) => ({ ...d, spending: null })),
]

const incomeLimit = 3500 // Monthly income limit
const projectedTotal = currentSpending + dailyBurnRate * (30 - currentDay)
const willExceedLimit = projectedTotal > incomeLimit

export function BurnRateProjector() {
  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-[#CCFF00]" />
            <h2 className="text-xl font-bold text-white">Burn Rate Projector</h2>
          </div>
          <p className="text-sm text-white/50">Historical spending + AI forecast to month end</p>
        </div>

        <div className="flex flex-col md:items-end gap-1">
          <p className="text-sm text-white/60">Current Spending</p>
          <p className="text-3xl font-bold text-white">${currentSpending.toFixed(0)}</p>
          <p className="text-xs text-white/50">Day {currentDay} of 30</p>
        </div>
      </div>

      {/* Alert if exceeding limit */}
      {willExceedLimit && (
        <div className="mb-6 glass rounded-xl p-4 border border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-1">Budget Alert</h3>
              <p className="text-sm text-white/70">
                Projected spending (${projectedTotal.toFixed(0)}) will exceed your income limit (${incomeLimit}) by $
                {(projectedTotal - incomeLimit).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-[300px] md:h-[400px]">
        <ChartContainer
          config={{
            spending: {
              label: "Actual Spending",
              color: "#CCFF00",
            },
            forecast: {
              label: "Forecast",
              color: "#CCFF00",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {/* Gradient for danger zone */}
                <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)" }} />

              {/* Income limit line */}
              <ReferenceLine y={incomeLimit} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2}>
                <text x="95%" y={incomeLimit - 10} fill="#ef4444" fontSize={12} textAnchor="end">
                  Income Limit
                </text>
              </ReferenceLine>

              {/* Danger zone (if forecast exceeds limit) */}
              {willExceedLimit && (
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="none"
                  fill="url(#dangerGradient)"
                  fillOpacity={1}
                  isAnimationActive={false}
                />
              )}

              <ChartTooltip content={<ChartTooltipContent />} />

              {/* Historical spending - solid line */}
              <Line
                type="monotone"
                dataKey="spending"
                stroke="var(--color-spending)"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
              />

              {/* Forecast - dashed line */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--color-forecast)"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <p className="text-xs text-white/50 mb-1">Daily Burn Rate</p>
          <p className="text-lg font-bold text-[#CCFF00]">${dailyBurnRate.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-1">Days Remaining</p>
          <p className="text-lg font-bold text-white">{30 - currentDay}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-1">Projected Total</p>
          <p className={`text-lg font-bold ${willExceedLimit ? "text-red-400" : "text-white"}`}>
            ${projectedTotal.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-1">Budget Status</p>
          <p className={`text-lg font-bold ${willExceedLimit ? "text-red-400" : "text-[#00FF66]"}`}>
            {willExceedLimit ? "Over" : "On Track"}
          </p>
        </div>
      </div>
    </div>
  )
}
