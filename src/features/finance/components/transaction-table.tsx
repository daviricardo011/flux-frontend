import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction } from "../types";

interface TransactionTableProps {
  data: Transaction[];
}

export function TransactionTable({ data }: TransactionTableProps) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <h3 className="text-xl font-bold text-white mb-4">Transações Recentes</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-white/50 pb-3 pr-4">Data</th>
              <th className="text-left text-xs font-medium text-white/50 pb-3 pr-4">Categoria</th>
              <th className="text-left text-xs font-medium text-white/50 pb-3 pr-4">Descrição</th>
              <th className="text-right text-xs font-medium text-white/50 pb-3">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/40 text-sm">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              data.map((tx) => (
                <tr key={tx.id} className="glass-hover transition-colors hover:bg-white/5">
                  <td className="py-3 pr-4 text-sm text-white/70">
                    {/* Formata a data (ex: 26 de Dez) */}
                    {tx.date ? format(new Date(tx.date), "dd 'de' MMM", { locale: ptBR }) : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        {/* Ícone genérico baseado no tipo, já que não salvamos ícones por categoria ainda */}
                        {tx.type === "income" ? (
                           <TrendingUp className="w-4 h-4 text-[#CCFF00]" />
                        ) : (
                           <TrendingDown className="w-4 h-4 text-white/70" />
                        )}
                      </div>
                      <span className="text-sm text-white capitalize">{tx.category}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/70">{tx.description}</td>
                  <td
                    className={`py-3 text-right text-sm font-semibold ${
                      tx.type === "income" ? "text-[#CCFF00]" : "text-white"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {Number(tx.amount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}