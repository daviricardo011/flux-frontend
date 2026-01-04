import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction } from "../types";
import { Button } from "@/components/ui/button";
import type { Category } from "@/services/category-service";
import { CategoryBadge } from "./category-badge";

interface TransactionListProps {
  data: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

export function TransactionList({
  data,
  categories = [],
  onDelete,
}: TransactionListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(`${dateString}T12:00:00`);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      {data.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-xl glass border border-white/5 hover:border-white/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            {/* Ícone Grande usando a cor da categoria */}
            <CategoryBadge
              categoryName={transaction.category}
              categories={categories}
              size="md"
              showLabel={false}
            />

            <div>
              <h4 className="font-bold text-white">
                {transaction.description}
              </h4>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>{formatDate(transaction.date)}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{transaction.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`font-bold ${
                transaction.type === "income" ? "text-[#CCFF00]" : "text-white"
              }`}
            >
              {transaction.type === "expense" ? "- " : "+ "}
              {Number(transaction.amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white/10 hover:text-red-500 hover:bg-red-400/10"
              onClick={() => onDelete(transaction.id!)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
