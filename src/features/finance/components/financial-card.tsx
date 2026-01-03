import { DollarSign, Plus, TrendingUp } from "lucide-react"
import { Button } from "../../../components/ui/button"

export function FinancialCard() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-white/60 mb-1">Current Balance</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white">$12,483</h2>
            <span className="text-[#CCFF00] text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-[#CCFF00]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">Income</p>
          <p className="text-lg font-semibold text-[#CCFF00]">+$4,230</p>
        </div>
        <div className="glass rounded-lg p-3">
          <p className="text-xs text-white/50 mb-1">Expenses</p>
          <p className="text-lg font-semibold text-red-400">-$1,847</p>
        </div>
      </div>

      <Button className="w-full bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-semibold rounded-xl h-11 glow-lime">
        <Plus className="w-4 h-4 mr-2" />
        Add Transaction
      </Button>
    </div>
  )
}
