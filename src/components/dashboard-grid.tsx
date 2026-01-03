import { FinancialCard } from "../features/finance/components/financial-card"
import { SpendingChart } from "./spending-chart"
import { HabitScore } from "./habit-score"
import { TransactionTable } from "../features/finance/components/transaction-table"
import { TransactionList } from "../features/finance/components/transaction-list"
import { HabitList } from "./habit-list"

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Top Row - Metrics */}
      <div className="md:col-span-2">
        <FinancialCard />
      </div>

      <div className="md:col-span-1">
        <SpendingChart />
      </div>

      <div className="md:col-span-1">
        <HabitScore />
      </div>

      {/* Main Area - Desktop: Table + Habits side by side */}
      <div className="lg:col-span-3 hidden lg:block">
        <TransactionTable />
      </div>

      {/* Mobile: Transaction List */}
      <div className="md:col-span-2 lg:hidden">
        <TransactionList />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <HabitList />
      </div>
    </div>
  )
}
