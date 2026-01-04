 ;

import { useEffect, useState } from "react";
import { BalanceHeader } from "@/features/finance/components/balance-header"; // Usando o header novo e dinâmico
import { SpendingChart } from "./spending-chart";
import { HabitScore } from "./habit-score";
import { TransactionTable } from "@/features/finance/components/transaction-table";
import { TransactionList } from "@/features/finance/components/transaction-list";
import { HabitList } from "./habit-list";
import { TransactionService } from "@/services/transaction-service";
import type { Transaction } from "@/features/finance/types";
import { useAuth } from "@/features/auth/auth";

export function DashboardGrid() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;

    // Busca transações em tempo real
    const unsubscribe = TransactionService.subscribeToTransactions((data) => {
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Pega apenas as 5 últimas para a Home não ficar gigante
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Linha do Topo - Métricas */}
      <div className="md:col-span-2">
        {/* Agora mostra o saldo real! */}
        <BalanceHeader transactions={transactions} />
      </div>

      <div className="md:col-span-1">
        <SpendingChart />
      </div>

      <div className="md:col-span-1">
        <HabitScore />
      </div>

      {/* Área Principal - Desktop: Tabela */}
      <div className="lg:col-span-3 hidden lg:block">
        <TransactionTable data={recentTransactions} />
      </div>

      {/* Mobile: Lista de Transações */}
      <div className="md:col-span-2 lg:hidden">
        <TransactionList
          data={recentTransactions}
          onDelete={TransactionService.deleteTransaction}
        />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <HabitList />
      </div>
    </div>
  );
}
