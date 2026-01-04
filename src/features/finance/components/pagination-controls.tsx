import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-white/10 mt-4">
      {/* Informação de Itens */}
      <div className="text-sm text-white/50">
        Mostrando {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} a{" "}
        {Math.min(itemsPerPage * currentPage, totalItems)} de {totalItems}{" "}
        resultados
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Seletor de Itens por Página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50 hidden sm:inline">
            Linhas por página
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(val) => onItemsPerPageChange(Number(val))}
          >
            <SelectTrigger className="w-[70px] h-8 bg-black/20 border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navegação */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-white/50 w-[80px] text-center">
            Pág {currentPage} de {Math.max(1, totalPages)}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:text-[#CCFF00] disabled:opacity-30"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:text-[#CCFF00] disabled:opacity-30"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
    