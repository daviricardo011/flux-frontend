import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionService } from "@/services/transaction-service";
import type { Transaction } from "../types";

interface TransactionTableProps {
  data?: Transaction[];
}

export function TransactionTable({ data = [] }: TransactionTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(`${dateString}T12:00:00`);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/60">Data</TableHead>
            <TableHead className="text-white/60">Descrição</TableHead>
            <TableHead className="text-white/60">Categoria</TableHead>
            <TableHead className="text-white/60 text-right">Valor</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-white/40">
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data.map((t) => (
              <TableRow
                key={t.id}
                className="border-white/10 hover:bg-white/5 group"
              >
                <TableCell className="text-white/80 font-medium">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell className="text-white">{t.description}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70 border border-white/10">
                    {t.category}
                  </span>
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
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400/10"
                    onClick={() => TransactionService.deleteTransaction(t.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
