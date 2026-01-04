import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CategoryService, type Category } from "@/services/category-service";
import { iconMap, getIconComponent, iconOptions } from "@/lib/icons";
import { useAuth } from "@/features/auth/auth";

const colorOptions = [
  "#CCFF00",
  "#8B5CF6",
  "#FF6B6B",
  "#00FF66",
  "#FFD700",
  "#00A8E1",
  "#FFB800",
  "#E50914",
  "#34D399",
  "#F59E0B",
];

export function CategoryManager() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newIncomeName, setNewIncomeName] = useState("");
  const [newExpenseName, setNewExpenseName] = useState("");

  useEffect(() => {
    if (!user) return;

    // MUDANÇA AQUI: subscribe -> subscribeToCategories
    const unsubscribe = CategoryService.subscribeToCategories((data) => {
      setCategories(data);
    });

    return () => unsubscribe();
  }, [user]);

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleUpdate = async (id: string, updates: Partial<Category>) => {
    try {
      // MUDANÇA AQUI: update -> updateCategory
      await CategoryService.updateCategory(id, updates);
      // setEditingId(null); // Comentado para permitir edição contínua se quiser
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        // MUDANÇA AQUI: delete -> deleteCategory
        await CategoryService.deleteCategory(id);
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  const handleAdd = async (type: "income" | "expense") => {
    const name = type === "income" ? newIncomeName : newExpenseName;
    if (!name.trim() || !user) return;

    try {
      // MUDANÇA AQUI: add -> addCategory
      await CategoryService.addCategory({
        name: name.trim(),
        type,
        icon: type === "income" ? "TrendingUp" : "ShoppingBag",
        color: colorOptions[0],
      });

      if (type === "income") setNewIncomeName("");
      else setNewExpenseName("");
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  };

  const CategoryItem = ({ category }: { category: Category }) => {
    // Fallback para ícone se não existir
    const Icon = getIconComponent(category.icon || "Circle"); 
    const isEditing = editingId === category.id;

    return (
      <div className="flex items-center gap-3 p-3 rounded-xl glass-hover border border-white/10 transition-all group relative pr-10">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
              style={{ backgroundColor: `${category.color || '#fff'}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: category.color || '#fff' }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="glass border border-white/10 p-3 w-72">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-white/60 mb-2">
                  Ícone
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((iconName) => {
                    const IconComp = iconMap[iconName];
                    return (
                      <button
                        key={iconName}
                        onClick={() =>
                          handleUpdate(category.id, { icon: iconName })
                        }
                        className={cn(
                          "w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all",
                          category.icon === iconName &&
                            "bg-white/20 ring-1 ring-white/50"
                        )}
                      >
                        <IconComp className="w-4 h-4 text-white/70" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/60 mb-2">Cor</p>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleUpdate(category.id, { color })}
                      className={cn(
                        "w-8 h-8 rounded-lg transition-all hover:scale-110",
                        category.color === color &&
                          "ring-2 ring-white ring-offset-2 ring-offset-[#050505]"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {isEditing ? (
          <Input
            autoFocus
            defaultValue={category.name}
            onBlur={(e) => {
                handleUpdate(category.id, { name: e.target.value });
                setEditingId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdate(category.id, { name: e.currentTarget.value });
                setEditingId(null);
              }
            }}
            className="flex-1 bg-white/5 border-white/20 text-white h-8"
          />
        ) : (
          <button
            onClick={() => setEditingId(category.id)}
            className="flex-1 text-left text-sm font-medium text-white hover:text-[#CCFF00] transition-colors truncate"
          >
            {category.name}
          </button>
        )}

        <button
          onClick={() => handleDelete(category.id)}
          className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Coluna Receitas */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-[#00FF66]">↑</span>
          Categorias de Receita
        </h3>

        <div className="space-y-2 mb-4 min-h-[100px]">
          {incomeCategories.length === 0 && (
            <p className="text-white/20 text-sm text-center py-4">
              Nenhuma categoria encontrada.
            </p>
          )}
          {incomeCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <Input
            placeholder="Nova categoria..."
            value={newIncomeName}
            onChange={(e) => setNewIncomeName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd("income")}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
          />
          <Button
            onClick={() => handleAdd("income")}
            className="bg-[#00FF66] hover:bg-[#00FF66]/80 text-black font-medium w-10 px-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Coluna Despesas */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-[#FF6B6B]">↓</span>
          Categorias de Despesa
        </h3>

        <div className="space-y-2 mb-4 min-h-[100px]">
          {expenseCategories.length === 0 && (
            <p className="text-white/20 text-sm text-center py-4">
              Nenhuma categoria encontrada.
            </p>
          )}
          {expenseCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <Input
            placeholder="Nova categoria..."
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd("expense")}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
          />
          <Button
            onClick={() => handleAdd("expense")}
            className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/80 text-white font-medium w-10 px-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}