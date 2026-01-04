import type { Category } from "@/services/category-service";
import { getIconComponent } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  categoryName: string;
  categories: Category[];
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function CategoryBadge({
  categoryName,
  categories = [],
  size = "sm",
  showLabel = true,
}: CategoryBadgeProps) {
  // 1. Procura a configuração da categoria (cor/ícone) na lista
  const category = categories?.find((c) => c.name === categoryName);

  // 2. Busca o componente do ícone usando sua lib existente
  // Se não tiver categoria (ex: apagada), usa DollarSign como padrão
  const Icon = getIconComponent(category?.icon || "DollarSign");

  // 3. Define a cor (ou cinza padrão)
  const color = category?.color || "#808080";

  // Estilos de tamanho
  const sizeClasses = size === "sm" ? "w-6 h-6 p-1" : "w-10 h-10 p-2.5";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-lg flex items-center justify-center border border-white/5",
          sizeClasses
        )}
        style={{
          backgroundColor: `${color}15`, // 15% de opacidade no fundo (gera o efeito glass colorido)
          color: color,
        }}
      >
        <Icon className={iconSize} />
      </div>

      {showLabel && (
        <span className="text-white/80 text-sm font-medium truncate max-w-[120px]">
          {categoryName}
        </span>
      )}
    </div>
  );
}
