import { Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction } from "../types";
import { Button } from "@/components/ui/button";
import type { Category } from "@/services/category-service";
import { CategoryBadge } from "./category-badge";
import { Checkbox } from "@/components/ui/checkbox"; // <--- Importando do UI Kit

interface TransactionListProps {
  data: Transaction[];
  categories?: Category[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
}

export function TransactionList({
  data,
  categories = [],
  onDelete,
  onEdit,
  selectedIds,
  onSelect,
}: TransactionListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(`${dateString}T12:00:00`);
    return format(date, "dd 'de' MMM", { locale: ptBR });
  };

  return (
    <div className="space-y-3">
      {data.map((transaction) => {
        const isSelected = selectedIds.includes(transaction.id!);

        return (
          <div
            key={transaction.id}
            className={`glass p-4 rounded-xl flex flex-col gap-3 border transition-all
            ${
              isSelected
                ? "border-[#CCFF00]/50 bg-[#CCFF00]/5"
                : "border-white/10"
            }`}
          >
            {/* Linha Superior: Checkbox + Ícone + Info Principal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelect(transaction.id!)}
                  className="border-white/20 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:text-black"
                />

                <CategoryBadge
                  categoryName={transaction.category}
                  categories={categories}
                  size="md"
                  showLabel={false}
                />

                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">
                    {transaction.description}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                    <span>{formatDate(transaction.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/40">
                      {transaction.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`font-bold text-sm ${
                    transaction.type === "income"
                      ? "text-[#CCFF00]"
                      : "text-white"
                  }`}
                >
                  {transaction.type === "expense" ? "- " : "+ "}
                  {Number(transaction.amount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            {/* Linha Inferior: Botões de Ação */}
            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-white/60 hover:text-white hover:bg-white/10"
                  onClick={() => onEdit(transaction)}
                >
                  <Edit2 className="w-3 h-3 mr-2" /> Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-white/60 hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => onDelete(transaction.id!)}
                >
                  <Trash2 className="w-3 h-3 mr-2" /> Excluir
                </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}