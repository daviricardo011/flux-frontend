import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "../types";

interface TransactionListProps {
  data: Transaction[];
  onDelete: (id: string) => Promise<void>;
}

export function TransactionList({ data, onDelete }: TransactionListProps) {
  const handleDelete = async (id: string) => {
    // Confirmação simples do navegador
    if (window.confirm("Tem certeza que deseja excluir esta movimentação?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {data.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-xl glass border border-white/5 hover:border-white/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            {/* Ícone de Receita/Despesa */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === "income"
                  ? "bg-[#CCFF00]/10 text-[#CCFF00]"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {transaction.type === "income" ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>

            {/* Texto */}
            <div>
              <p className="font-semibold text-white">{transaction.description}</p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="capitalize px-2 py-0.5 rounded-full bg-white/5">
                  {transaction.category}
                </span>
                <span>•</span>
                <span>
                  {/* Tratamento de data para evitar erro se a string for inválida */}
                  {transaction.date ? format(new Date(transaction.date), "dd 'de' MMMM", {
                    locale: ptBR,
                  }) : "Data inválida"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Valor */}
            <span
              className={`font-bold ${
                transaction.type === "income" ? "text-[#CCFF00]" : "text-white"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {Number(transaction.amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            
            {/* Botão de Excluir (Só aparece ao passar o mouse) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(transaction.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}