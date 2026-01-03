"use client"

import { ShoppingBag, Coffee, Zap, Home, TrendingUp, Wifi, Car } from "lucide-react"

const transactions = [
  {
    id: 1,
    date: "Dec 27, 2025",
    category: "Shopping",
    description: "Amazon Purchase",
    amount: -89.99,
    icon: ShoppingBag,
  },
  {
    id: 2,
    date: "Dec 27, 2025",
    category: "Food & Drink",
    description: "Starbucks Coffee",
    amount: -5.5,
    icon: Coffee,
  },
  { id: 3, date: "Dec 26, 2025", category: "Utilities", description: "Electric Bill", amount: -125.0, icon: Zap },
  { id: 4, date: "Dec 26, 2025", category: "Income", description: "Salary Deposit", amount: 4230.0, icon: TrendingUp },
  { id: 5, date: "Dec 25, 2025", category: "Housing", description: "Rent Payment", amount: -1200.0, icon: Home },
  {
    id: 6,
    date: "Dec 24, 2025",
    category: "Food & Drink",
    description: "Grocery Store",
    amount: -87.32,
    icon: ShoppingBag,
  },
  { id: 7, date: "Dec 23, 2025", category: "Internet", description: "Comcast Bill", amount: -79.99, icon: Wifi },
  { id: 8, date: "Dec 22, 2025", category: "Transport", description: "Gas Station", amount: -45.0, icon: Car },
]

export function TransactionView() {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="bg-white/5">
                <th className="text-left text-xs font-semibold text-white/60 p-4">Date</th>
                <th className="text-left text-xs font-semibold text-white/60 p-4">Category</th>
                <th className="text-left text-xs font-semibold text-white/60 p-4">Description</th>
                <th className="text-right text-xs font-semibold text-white/60 p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const Icon = tx.icon
                return (
                  <tr key={tx.id} className="border-b border-white/5 glass-hover transition-all cursor-pointer">
                    <td className="p-4 text-sm text-white/70">{tx.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white/70" />
                        </div>
                        <span className="text-sm font-medium text-white inline-block px-3 py-1 rounded-full bg-white/5">
                          {tx.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white">{tx.description}</td>
                    <td
                      className={`p-4 text-right text-sm font-bold ${tx.amount > 0 ? "text-[#00FF66]" : "text-white"}`}
                    >
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {transactions.map((tx) => {
          const Icon = tx.icon
          return (
            <div
              key={tx.id}
              className="glass rounded-xl p-4 border border-white/10 glass-hover transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{tx.description}</p>
                  <p className="text-xs text-white/50">{tx.date}</p>
                </div>
                <div className={`text-lg font-bold flex-shrink-0 ${tx.amount > 0 ? "text-[#00FF66]" : "text-white"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60 px-2 py-1 rounded-md bg-white/5">{tx.category}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
