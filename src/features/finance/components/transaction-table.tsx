import { ShoppingBag, Coffee, Zap, Home, TrendingUp } from "lucide-react"

const transactions = [
  { id: 1, date: "Dec 26", category: "Shopping", description: "Amazon Purchase", amount: -89.99, icon: ShoppingBag },
  { id: 2, date: "Dec 26", category: "Food", description: "Starbucks Coffee", amount: -5.5, icon: Coffee },
  { id: 3, date: "Dec 25", category: "Utilities", description: "Electric Bill", amount: -125.0, icon: Zap },
  { id: 4, date: "Dec 24", category: "Income", description: "Salary Deposit", amount: 4230.0, icon: TrendingUp },
  { id: 5, date: "Dec 23", category: "Housing", description: "Rent Payment", amount: -1200.0, icon: Home },
  { id: 6, date: "Dec 22", category: "Food", description: "Grocery Store", amount: -87.32, icon: ShoppingBag },
]

export function TransactionTable() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-white/50 pb-3 pr-4">Date</th>
              <th className="text-left text-xs font-medium text-white/50 pb-3 pr-4">Category</th>
              <th className="text-left text-xs font-medium text-white/50 pb-3 pr-4">Description</th>
              <th className="text-right text-xs font-medium text-white/50 pb-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const Icon = tx.icon
              return (
                <tr key={tx.id} className="glass-hover transition-colors">
                  <td className="py-3 pr-4 text-sm text-white/70">{tx.date}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white/70" />
                      </div>
                      <span className="text-sm text-white">{tx.category}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/70">{tx.description}</td>
                  <td
                    className={`py-3 text-right text-sm font-semibold ${
                      tx.amount > 0 ? "text-[#CCFF00]" : "text-red-400"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
