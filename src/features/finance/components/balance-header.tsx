import { useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Sparkline } from "@/components/sparkline";
import { subMonths, isBefore, endOfMonth } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Transaction } from "@/features/finance/types";

interface BalanceHeaderProps {
  transactions: Transaction[];
}

export function BalanceHeader({ transactions }: BalanceHeaderProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);

    // 1. Cálculos de Totais (Receita/Despesa/Saldo Atual)
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const currentBalance = totalIncome - totalExpense;

    // 2. Saldo mês anterior (para variação percentual)
    const lastMonthEnd = endOfMonth(lastMonth);
    const prevTransactions = transactions.filter((t) => 
      isBefore(new Date(t.date), lastMonthEnd)
    );
    
    const prevBalance = prevTransactions.reduce((acc, t) => {
      return acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount));
    }, 0);

    // 3. Variação Percentual
    const percentChange = prevBalance === 0
      ? 0
      : ((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100;

    // 4. Gráfico de Tendência de SALDO (Running Balance)
    // Ordenar cronologicamente: Antigas -> Recentes
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningBalance = 0;
    const balanceHistory = sortedTransactions.map((t) => {
      const amount = Number(t.amount);
      if (t.type === "income") {
        runningBalance += amount;
      } else {
        runningBalance -= amount;
      }

      return {
        value: runningBalance, // O valor no gráfico é o saldo acumulado naquele momento
        date: new Date(t.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        }),
      };
    });

    // Pegamos os últimos 20 pontos para o gráfico não ficar polúido
    // Se quiser o histórico todo, remova o .slice
    const chartData = balanceHistory.length > 0 
      ? balanceHistory.slice(-20) 
      : [{ value: 0, date: "" }];

    return {
      totalBalance: currentBalance,
      totalIncome,
      totalExpense,
      percentChange,
      chartData,
    };
  }, [transactions]);

  const formatMoney = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          {/* Tooltip de Detalhes */}
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 mb-2 w-fit cursor-help">
                  <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center transition-colors hover:bg-[#CCFF00]/20">
                    <DollarSign className="w-5 h-5 text-[#CCFF00]" />
                  </div>
                  <p className="text-sm text-white/60">Saldo Atual</p>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#0a0a0a] border-white/10 p-3"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Resumo Geral
                  </p>
                  <div className="flex items-center gap-2 text-[#CCFF00]">
                    <ArrowUpCircle className="w-4 h-4" />
                    <span className="font-mono">
                      {formatMoney(stats.totalIncome)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <ArrowDownCircle className="w-4 h-4" />
                    <span className="font-mono">
                      {formatMoney(stats.totalExpense)}
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              {formatMoney(stats.totalBalance)}
            </h1>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={`text-lg font-semibold flex items-center gap-1 cursor-help transition-opacity hover:opacity-80 ${
                      stats.percentChange >= 0
                        ? "text-[#CCFF00]"
                        : "text-red-400"
                    }`}
                  >
                    {stats.percentChange >= 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    {stats.percentChange > 0 ? "+" : ""}
                    {stats.percentChange.toFixed(1)}%
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <p>
                    {stats.percentChange >= 0
                      ? "Crescimento em relação ao mês anterior"
                      : "Redução em relação ao mês anterior"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="glass rounded-xl p-4 border border-white/10">
            <p className="text-xs text-white/50 mb-3">
              Evolução do Saldo (Últimos lançamentos)
            </p>
            <Sparkline data={stats.chartData} color="#CCFF00" height={80} />
          </div>
        </div>
      </div>
    </div>
  );
}