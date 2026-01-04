import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox"; // <--- Importando do UI Kit
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "../types";
import type { Category } from "@/services/category-service";
import { CategoryBadge } from "./category-badge";

interface TransactionTableProps {
  data?: Transaction[];
  categories?: Category[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({
  data = [],
  categories = [],
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(`${dateString}T12:00:00`);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="w-[50px] pl-4">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                className="border-white/20 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:text-black"
              />
            </TableHead>
            <TableHead className="text-white/60">Data</TableHead>
            <TableHead className="text-white/60">Descrição</TableHead>
            <TableHead className="text-white/60">Categoria</TableHead>
            <TableHead className="text-white/60 text-right">Valor</TableHead>
            <TableHead className="w-[100px] text-right pr-4">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-white/40">
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data.map((t) => {
              const isSelected = selectedIds.includes(t.id!);
              return (
                <TableRow
                  key={t.id}
                  className={`border-white/10 hover:bg-white/5 transition-colors ${
                    isSelected ? "bg-[#CCFF00]/5" : ""
                  }`}
                >
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelect(t.id!)}
                      className="border-white/20 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:text-black"
                    />
                  </TableCell>
                  <TableCell className="text-white/80 font-medium text-xs md:text-sm">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {t.description}
                  </TableCell>
                  <TableCell>
                    <CategoryBadge
                      categoryName={t.category}
                      categories={categories}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-bold flex items-center justify-end gap-1 ${
                        t.type === "income" ? "text-[#CCFF00]" : "text-white"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {Number(t.amount).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => onEdit(t)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-red-400/10"
                        onClick={() => onDelete(t.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
