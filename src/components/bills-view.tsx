import { useState } from "react"
import { CreditCard, Wifi, Zap, Home, Phone, Tv } from "lucide-react"
import { cn } from "@/lib/utils"

const initialBills = [
  { id: 1, name: "Netflix Subscription", dueDate: "Jan 5", amount: 15.99, paid: true, icon: Tv, color: "#E50914" },
  { id: 2, name: "Internet Bill", dueDate: "Jan 10", amount: 79.99, paid: false, icon: Wifi, color: "#00A8E1" },
  { id: 3, name: "Electric Utility", dueDate: "Jan 15", amount: 125.0, paid: false, icon: Zap, color: "#FFB800" },
  { id: 4, name: "Rent Payment", dueDate: "Jan 1", amount: 1200.0, paid: true, icon: Home, color: "#34D399" },
  { id: 5, name: "Phone Plan", dueDate: "Jan 8", amount: 55.0, paid: false, icon: Phone, color: "#8B5CF6" },
  { id: 6, name: "Credit Card", dueDate: "Jan 20", amount: 340.5, paid: false, icon: CreditCard, color: "#CCFF00" },
]

export function BillsView() {
  const [bills, setBills] = useState(initialBills)

  const togglePaid = (id: number) => {
    setBills((prev) => prev.map((bill) => (bill.id === id ? { ...bill, paid: !bill.paid } : bill)))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bills.map((bill) => {
        const Icon = bill.icon
        return (
          <div
            key={bill.id}
            className={cn(
              "glass rounded-2xl p-6 border transition-all duration-300 cursor-pointer relative overflow-hidden",
              bill.paid ? "border-[#CCFF00]/30 bg-[#CCFF00]/5" : "border-white/10 glass-hover",
            )}
            onClick={() => togglePaid(bill.id)}
          >
            {/* Card gradient accent */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ background: bill.color }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${bill.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: bill.color }} />
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                  bill.paid ? "bg-[#CCFF00] border-[#CCFF00]" : "border-white/30",
                )}
              >
                {bill.paid && (
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>

            {/* Bill Info */}
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-1">{bill.name}</h3>
              <p className="text-sm text-white/50 mb-4">Due: {bill.dueDate}</p>

              {/* Amount */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${bill.amount.toFixed(2)}</span>
                {bill.paid && <span className="text-xs font-medium text-[#CCFF00] ml-2">PAID</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
