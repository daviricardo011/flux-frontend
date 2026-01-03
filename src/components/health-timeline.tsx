"use client"

import { FileText, Activity, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const timelineEvents = [
  {
    id: 1,
    type: "journal",
    date: "2024-12-27",
    time: "08:30 AM",
    title: "Morning Wellness Check",
    content: "Feeling great today! Good sleep and morning workout helped.",
    mood: 8,
    energy: 9,
  },
  {
    id: 2,
    type: "symptom",
    date: "2024-12-26",
    time: "09:45 PM",
    title: "Symptom Log",
    symptoms: ["Bloating", "Fatigue"],
    severity: 6,
  },
  {
    id: 3,
    type: "transaction",
    date: "2024-12-26",
    time: "08:15 PM",
    title: "Late Dinner",
    category: "Food & Drink",
    amount: 45.0,
  },
  {
    id: 4,
    type: "journal",
    date: "2024-12-25",
    time: "07:00 AM",
    title: "Christmas Morning",
    content: "Low energy, but mood is good. Family time ahead!",
    mood: 7,
    energy: 4,
  },
  {
    id: 5,
    type: "symptom",
    date: "2024-12-24",
    time: "11:30 PM",
    title: "Evening Symptoms",
    symptoms: ["Anxiety", "Insomnia"],
    severity: 8,
  },
  {
    id: 6,
    type: "transaction",
    date: "2024-12-24",
    time: "09:30 PM",
    title: "Late Coffee",
    category: "Food & Drink",
    amount: 6.5,
  },
]

export function HealthTimeline() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "journal":
        return FileText
      case "symptom":
        return Activity
      case "transaction":
        return DollarSign
      default:
        return FileText
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "journal":
        return "text-[#22D3EE] bg-[#22D3EE]/20"
      case "symptom":
        return "text-orange-400 bg-orange-500/20"
      case "transaction":
        return "text-[#CCFF00] bg-[#CCFF00]/20"
      default:
        return "text-white bg-white/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-[#22D3EE]/20">
        <h2 className="text-xl font-bold text-white mb-2">Health Timeline</h2>
        <p className="text-sm text-white/60">See how your health connects with daily activities and spending</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#22D3EE]/50 via-[#22D3EE]/20 to-transparent" />

        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const Icon = getEventIcon(event.type)
            const colorClass = getEventColor(event.type)

            return (
              <div key={event.id} className="relative pl-16">
                {/* Icon */}
                <div
                  className={cn(
                    "absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center z-10",
                    colorClass,
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content Card */}
                <div className="glass rounded-xl p-4 border border-white/10 hover:border-[#22D3EE]/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <p className="text-xs text-white/50">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        event.type === "journal" && "bg-[#22D3EE]/20 text-[#22D3EE]",
                        event.type === "symptom" && "bg-orange-500/20 text-orange-400",
                        event.type === "transaction" && "bg-[#CCFF00]/20 text-[#CCFF00]",
                      )}
                    >
                      {event.type}
                    </span>
                  </div>

                  {/* Journal Content */}
                  {event.type === "journal" && (
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">{event.content}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-white/60">
                          Mood: <span className="text-[#22D3EE] font-bold">{event.mood}/10</span>
                        </span>
                        <span className="text-white/60">
                          Energy: <span className="text-[#22D3EE] font-bold">{event.energy}/10</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Symptom Content */}
                  {event.type === "symptom" && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {event.symptoms?.map((symptom) => (
                          <span
                            key={symptom}
                            className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-white/60">
                        Severity: <span className="text-orange-400 font-bold">{event.severity}/10</span>
                      </p>
                    </div>
                  )}

                  {/* Transaction Content */}
                  {event.type === "transaction" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">{event.category}</span>
                      <span className="text-lg font-bold text-[#CCFF00]">${event.amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Load More */}
      <button className="w-full glass rounded-xl py-3 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all">
        Load More Entries
      </button>
    </div>
  )
}
