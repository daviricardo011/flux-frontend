import { useState } from "react";
import { BalanceHeader } from "../features/finance/components/balance-header";
import { TransactionView } from "../features/finance/components/transaction-view";
import { BillsView } from "../components/bills-view";
import { TransactionFab } from "../features/finance/components/transaction-fab";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";

export function FinancePage() {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <div className="space-y-6">
      <BalanceHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass w-full md:w-auto rounded-xl p-1 border border-white/10">
          <TabsTrigger
            value="transactions"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black data-[state=active]:glow-lime transition-all"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="bills"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black data-[state=active]:glow-lime transition-all"
          >
            Bills / Recurring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <TransactionView />
        </TabsContent>

        <TabsContent value="bills" className="mt-6">
          <BillsView />
        </TabsContent>
      </Tabs>
      <TransactionFab />
    </div>
  );
}
