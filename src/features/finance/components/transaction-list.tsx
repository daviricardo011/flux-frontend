import { ShoppingBag, Coffee, Zap, Home, TrendingUp } from "lucide-react"

const transactions = [
  { id: 1, date: "Dec 26", category: "Shopping", description: "Amazon Purchase", amount: -89.99, icon: ShoppingBag },
  { id: 2, date: "Dec 26", category: "Food", description: "Starbucks Coffee", amount: -5.5, icon: Coffee },
  { id: 3, date: "Dec 25", category: "Utilities", description: "Electric Bill", amount: -125.0, icon: Zap },
  { id: 4, date: "Dec 24", category: "Income", description: "Salary Deposit", amount: 4230.0, icon: TrendingUp },
  { id: 5, date: "Dec 23", category: "Housing", description: "Rent Payment", amount: -1200.0, icon: Home },
]

export function TransactionList() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>

      <div className="space-y-2">
        {transactions.map((tx) => {
          const Icon = tx.icon
          return (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl glass-hover transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-white/50">
                    {tx.date} • {tx.category}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-bold ${tx.amount > 0 ? "text-[#CCFF00]" : "text-red-400"}`}>
                {tx.amount > 0 ? "+" : ""}
                {tx.amount.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
