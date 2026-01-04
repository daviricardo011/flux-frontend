 

import { BurnRateProjector } from "../components/burn-rate-projector"
import { SubscriptionKillSwitch } from "../components/subscription-kill-switch"
import { EmotionalInsights } from "../components/emotional-insights"
import { Brain } from "lucide-react"

export function IntelligencePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#CCFF00]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Intelligence</h1>
          <p className="text-sm text-white/50">Deep analytics & predictive insights</p>
        </div>
      </div>

      {/* Burn Rate Projector - Hero Section */}
      <BurnRateProjector />

      {/* Two Column Layout for Subscriptions and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionKillSwitch />
        <EmotionalInsights />
      </div>
    </div>
  )
}
