import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, Save, Smile, Meh, Frown, Battery, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const SYMPTOM_OPTIONS = [
  { id: "bloating", label: "Bloating", icon: "🫄" },
  { id: "headache", label: "Headache", icon: "🤕" },
  { id: "anxiety", label: "Anxiety", icon: "😰" },
  { id: "nausea", label: "Nausea", icon: "🤢" },
  { id: "fatigue", label: "Fatigue", icon: "😴" },
  { id: "pain", label: "Pain", icon: "⚡" },
  { id: "stress", label: "Stress", icon: "😵" },
  { id: "insomnia", label: "Insomnia", icon: "🌙" },
]

export function DailyLog() {
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(7)
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Map<string, number>())
  const [journalText, setJournalText] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const toggleSymptom = (id: string) => {
    const newSymptoms = new Map(selectedSymptoms)
    if (newSymptoms.has(id)) {
      newSymptoms.delete(id)
    } else {
      newSymptoms.set(id, 5)
    }
    setSelectedSymptoms(newSymptoms)
  }

  const updateSymptomSeverity = (id: string, value: number) => {
    const newSymptoms = new Map(selectedSymptoms)
    newSymptoms.set(id, value)
    setSelectedSymptoms(newSymptoms)
  }

  const getMoodIcon = () => {
    if (mood <= 3) return Frown
    if (mood <= 7) return Meh
    return Smile
  }

  const MoodIcon = getMoodIcon()

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="glass rounded-2xl p-4 border border-[#22D3EE]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <p className="text-sm text-white/50">Today's wellness check-in</p>
          </div>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="glass rounded-2xl p-6 border border-[#22D3EE]/20 space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Vitals</h2>

        {/* Mood Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MoodIcon className="w-5 h-5 text-[#22D3EE]" />
              <label className="text-white font-medium">Mood</label>
            </div>
            <span className="text-[#22D3EE] font-bold">{mood}/10</span>
          </div>
          <Slider
            value={[mood]}
            onValueChange={([val]) => setMood(val)}
            min={1}
            max={10}
            step={1}
            className="[&_[data-slot=slider-range]]:bg-[#22D3EE] [&_[data-slot=slider-thumb]]:border-[#22D3EE] [&_[data-slot=slider-thumb]]:shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          />
        </div>

        {/* Energy Level Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-[#22D3EE]" />
              <label className="text-white font-medium">Energy Level</label>
            </div>
            <span className="text-[#22D3EE] font-bold">{energy}/10</span>
          </div>
          <Slider
            value={[energy]}
            onValueChange={([val]) => setEnergy(val)}
            min={1}
            max={10}
            step={1}
            className="[&_[data-slot=slider-range]]:bg-[#22D3EE] [&_[data-slot=slider-thumb]]:border-[#22D3EE] [&_[data-slot=slider-thumb]]:shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          />
        </div>
      </div>

      {/* Symptom Selector */}
      <div className="glass rounded-2xl p-6 border border-[#22D3EE]/20 space-y-4">
        <h2 className="text-xl font-bold text-white">Symptoms</h2>
        <p className="text-sm text-white/60">Select any symptoms you're experiencing</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SYMPTOM_OPTIONS.map((symptom) => (
            <motion.button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "glass rounded-xl p-3 border transition-all text-left",
                selectedSymptoms.has(symptom.id)
                  ? "border-[#22D3EE] bg-[#22D3EE]/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  : "border-white/10 hover:border-white/20",
              )}
            >
              <div className="text-2xl mb-1">{symptom.icon}</div>
              <div className="text-sm font-medium text-white">{symptom.label}</div>
            </motion.button>
          ))}
        </div>

        {/* Severity Sliders for Selected Symptoms */}
        {selectedSymptoms.size > 0 && (
          <div className="space-y-4 mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white/80">Symptom Severity</h3>
            {Array.from(selectedSymptoms.entries()).map(([id, severity]) => {
              const symptom = SYMPTOM_OPTIONS.find((s) => s.id === id)
              return (
                <div key={id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{symptom?.label}</span>
                    <span className="text-sm text-[#22D3EE] font-bold">{severity}/10</span>
                  </div>
                  <Slider
                    value={[severity]}
                    onValueChange={([val]) => updateSymptomSeverity(id, val)}
                    min={1}
                    max={10}
                    step={1}
                    className="[&_[data-slot=slider-range]]:bg-[#22D3EE] [&_[data-slot=slider-thumb]]:border-[#22D3EE] [&_[data-slot=slider-thumb]]:shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Journal Editor */}
      <div className="glass rounded-2xl p-6 border border-[#22D3EE]/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Journal</h2>
          <motion.button
            onClick={() => setIsRecording(!isRecording)}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: isRecording ? Number.POSITIVE_INFINITY : 0 }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              isRecording
                ? "bg-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                : "bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30",
            )}
          >
            <Mic className={cn("w-5 h-5", isRecording ? "text-black" : "text-[#22D3EE]")} />
          </motion.button>
        </div>

        <Textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="How does your body feel today? Any patterns you noticed?"
          className="min-h-[200px] glass border-white/20 text-white resize-none focus:border-[#22D3EE] focus:ring-[#22D3EE] text-base leading-relaxed"
        />

        <Button className="w-full bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-black font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <Save className="w-4 h-4 mr-2" />
          Save Entry
        </Button>
      </div>
    </div>
  )
}
