import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Lightbulb, TrendingUp, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for symptom severity by date
const symptomData = new Map([
  ["2024-12-20", 8],
  ["2024-12-21", 6],
  ["2024-12-22", 3],
  ["2024-12-23", 7],
  ["2024-12-24", 9],
  ["2024-12-25", 2],
  ["2024-12-26", 5],
  ["2024-12-27", 1],
])

const insights = [
  {
    id: 1,
    title: "Late Night Eating Pattern",
    description: "You report High Symptoms on days you eat after 9 PM",
    correlation: 0.85,
    type: "warning",
  },
  {
    id: 2,
    title: "Exercise Benefits",
    description: "Your energy levels are 40% higher on days with morning exercise",
    correlation: 0.72,
    type: "positive",
  },
  {
    id: 3,
    title: "Sleep Quality Impact",
    description: "Mood scores improve by 30% with 7+ hours of sleep",
    correlation: 0.68,
    type: "positive",
  },
]

export function HealthDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getDaySeverity = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0]
    return symptomData.get(dateKey) || 0
  }

  const getSeverityColor = (severity: number) => {
    if (severity === 0) return "bg-white/5"
    if (severity <= 3) return "bg-[#22D3EE]/20"
    if (severity <= 6) return "bg-[#22D3EE]/40"
    if (severity <= 8) return "bg-[#22D3EE]/70"
    return "bg-[#22D3EE]"
  }

  return (
    <div className="space-y-6">
      {/* Symptom Heatmap */}
      <div className="glass rounded-2xl p-6 border border-[#22D3EE]/20 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/20 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Symptom Heatmap</h2>
            <p className="text-sm text-white/60">Track severity patterns over time</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border-0"
            classNames={{
              day: cn("relative"),
            }}
            components={{
              DayButton: ({ day, modifiers, ...props }) => {
                const severity = getDaySeverity(day.date)
                const colorClass = getSeverityColor(severity)

                return (
                  <button
                    {...props}
                    className={cn(
                      "relative w-full aspect-square rounded-lg transition-all hover:scale-110",
                      colorClass,
                      modifiers.selected && "ring-2 ring-[#22D3EE]",
                      modifiers.today && "border-2 border-[#22D3EE]/50",
                    )}
                  >
                    <span className="text-white text-sm">{day.date.getDate()}</span>
                  </button>
                )
              },
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
          <span className="text-xs text-white/60">Severity:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/5" />
            <span className="text-xs text-white/60">None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#22D3EE]/20" />
            <span className="text-xs text-white/60">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#22D3EE]/70" />
            <span className="text-xs text-white/60">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#22D3EE]" />
            <span className="text-xs text-white/60">Severe</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#22D3EE]" />
          <h2 className="text-xl font-bold text-white">Insights & Correlations</h2>
        </div>

        {insights.map((insight) => (
          <div
            key={insight.id}
            className={cn(
              "glass rounded-2xl p-6 border transition-all hover:border-[#22D3EE]/40",
              insight.type === "warning" ? "border-orange-500/20" : "border-[#22D3EE]/20",
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  insight.type === "warning" ? "bg-orange-500/20" : "bg-[#22D3EE]/20",
                )}
              >
                <TrendingUp
                  className={cn("w-6 h-6", insight.type === "warning" ? "text-orange-400" : "text-[#22D3EE]")}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                <p className="text-white/70 mb-3">{insight.description}</p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        insight.type === "warning" ? "bg-orange-400" : "bg-[#22D3EE]",
                      )}
                      style={{ width: `${insight.correlation * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#22D3EE]">{(insight.correlation * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
