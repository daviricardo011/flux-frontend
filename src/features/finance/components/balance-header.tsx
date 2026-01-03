"use client"

import { DollarSign, TrendingUp } from "lucide-react"
import { Sparkline } from "../../../components/sparkline"

const monthlyData = [8200, 8900, 9400, 10200, 11500, 11800, 12000, 12100, 12300, 12400, 12450, 12483]

export function BalanceHeader() {
  const currentBalance = 12483
  const previousBalance = 11100
  const percentChange = ((currentBalance - previousBalance) / previousBalance) * 100

  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#CCFF00]" />
            </div>
            <p className="text-sm text-white/60">Total Balance</p>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              ${currentBalance.toLocaleString()}
            </h1>
            <span className="text-[#CCFF00] text-lg font-semibold flex items-center gap-1">
              <TrendingUp className="w-5 h-5" />+{percentChange.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-white/50">vs. last month</p>
        </div>

        <div className="flex-1 max-w-md">
          <div className="glass rounded-xl p-4 border border-white/10">
            <p className="text-xs text-white/50 mb-3">12-Month Trend</p>
            <Sparkline data={monthlyData} color="#CCFF00" height={80} />
          </div>
        </div>
      </div>
    </div>
  )
}
