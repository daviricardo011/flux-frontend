"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Target,
  Trophy,
  Calendar,
  MoreVertical,
  Trash2,
  Edit2,
  TrendingUp,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/features/auth/auth";
import { GoalService } from "@/services/goal-service";
import { CategoryService, type Category } from "@/services/category-service"; // Importar Service
import { TransactionService } from "@/services/transaction-service"; // Importar TransactionService
import { type Goal } from "@/features/finance/types";
import { getIconComponent } from "@/lib/icons"; // Para mostrar ícone no card (opcional)

export function GoalsView() {
  const { user } = useAuth();

  // Dados
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Estado para categorias

  // Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  // Estados de Edição/Ação
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Form Data (adicionado campo category)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "",
  });

  const [amountValue, setAmountValue] = useState("");
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdraw"
  >("deposit");

  // Carregar Metas e Categorias
  useEffect(() => {
    if (!user) return;

    // 1. Escutar Metas
    const unsubGoals = GoalService.subscribeToGoals(setGoals);

    // 2. Buscar Categorias (apenas despesas, pois metas geralmente são gastos futuros/poupança)
    const fetchCats = async () => {
      try {
        const cats = await CategoryService.getCategories();
        if (cats) {
          setCategories(cats.filter((c) => c.type === "expense"));
        }
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    };
    fetchCats();

    return () => unsubGoals();
  }, [user]);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setSelectedGoal(null);
    setFormData({
      name: "",
      description: "",
      targetAmount: "",
      deadline: "",
      category: "",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || "",
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline || "",
      category: goal.category || "",
    });
    setIsCreateOpen(true);
  };

  const handleSaveGoal = async () => {
    if (!formData.name || !formData.targetAmount || !formData.category)
      return alert("Preencha nome, valor alvo e categoria");

    const payload = {
      name: formData.name,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline,
      category: formData.category,
    };

    try {
      if (selectedGoal) {
        await GoalService.updateGoal(selectedGoal.id!, payload);
      } else {
        await GoalService.addGoal(payload);
      }
      setIsCreateOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenTransaction = (goal: Goal, type: "deposit" | "withdraw") => {
    setSelectedGoal(goal);
    setTransactionType(type);
    setAmountValue("");
    setIsDepositOpen(true);
  };

  const handleConfirmTransaction = async () => {
    if (!selectedGoal || !amountValue) return;
    const value = parseFloat(amountValue);
    const today = new Date().toISOString().split("T")[0];

    // Validação de saldo
    if (transactionType === "withdraw" && value > selectedGoal.currentAmount) {
      alert("Saldo insuficiente nesta meta.");
      return;
    }

    try {
      if (transactionType === "deposit") {
        // 1. Aumenta o valor no cofre
        await GoalService.addMoney(
          selectedGoal.id!,
          selectedGoal.currentAmount,
          value
        );

        // 2. Tira do saldo disponível (Gera Despesa)
        // Isso serve tanto para "Compra Futura" quanto "Investimento"
        await TransactionService.addTransaction({
          description: `Depósito: ${selectedGoal.name}`,
          amount: value,
          type: "expense",
          category: selectedGoal.category || "Investimento", // Usa a categoria da meta (ex: Lazer, Carro, Investimento)
          date: today,
        });
      } else {
        // 1. Diminui o valor do cofre
        await GoalService.withdrawMoney(
          selectedGoal.id!,
          selectedGoal.currentAmount,
          value
        );

        // 2. Devolve ao saldo disponível (Gera Receita)
        await TransactionService.addTransaction({
          description: `Resgate: ${selectedGoal.name}`,
          amount: value,
          type: "income",
          // Se for investimento, volta como "Rendimento/Resgate".
          // Se for compra, volta como "Outros" para você poder gastar em seguida registrando a despesa real.
          category: "Outros",
          date: today,
        });
      }
      setIsDepositOpen(false);
    } catch (e) {
      console.error(e);
      alert("Erro ao processar transação");
    }
  };

  const handleDelete = async (goal: Goal) => {
    if (confirm("Tem certeza? O histórico dessa meta será perdido.")) {
      await GoalService.deleteGoal(goal.id!);
    }
  };

  const formatMoney = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#CCFF00]" />
          Metas & Sonhos
        </h3>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length === 0 && (
          <div className="col-span-full text-center py-12 glass rounded-2xl border border-white/10">
            <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/50">
              Nenhuma meta definida. O que você quer conquistar?
            </p>
          </div>
        )}

        {goals.map((goal) => {
          const progress = Math.min(
            100,
            (goal.currentAmount / goal.targetAmount) * 100
          );
          const isCompleted = progress >= 100;

          // Recuperar cor da categoria para o card (Visual Extra)
          const categoryData = categories.find((c) => c.name === goal.category);
          const Icon = getIconComponent(categoryData?.icon || "DollarSign");
          const accentColor = categoryData?.color || "#CCFF00";

          return (
            <div
              key={goal.id}
              className={cn(
                "glass p-6 rounded-2xl border transition-all flex flex-col justify-between",
                isCompleted
                  ? "border-[#CCFF00]/50 bg-[#CCFF00]/5"
                  : "border-white/10"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-3">
                    {/* Ícone da Categoria */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 shrink-0"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {goal.name}
                      </h4>
                      {goal.description && (
                        <p className="text-sm text-white/60 line-clamp-1">
                          {goal.description}
                        </p>
                      )}
                      {goal.deadline && (
                        <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> Alvo:{" "}
                          {format(new Date(goal.deadline), "dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-white -mr-2 -mt-2"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[#0a0a0a] border-white/10 text-white"
                    >
                      <DropdownMenuItem onClick={() => handleOpenEdit(goal)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenTransaction(goal, "withdraw")}
                      >
                        <Minus className="w-4 h-4 mr-2" /> Sacar Valor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400 focus:text-red-400"
                        onClick={() => handleDelete(goal)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-6 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">
                      Progresso ({progress.toFixed(0)}%)
                    </span>
                    <span className="text-white font-mono">
                      {formatMoney(goal.currentAmount)}{" "}
                      <span className="text-white/40">
                        / {formatMoney(goal.targetAmount)}
                      </span>
                    </span>
                  </div>
                  {/* Barra de progresso pintada com a cor da categoria */}
                  <Progress
                    value={progress}
                    className="h-3 bg-white/10"
                    indicatorClassName="transition-all duration-500"
                    style={
                      {
                        backgroundColor: isCompleted ? "#CCFF00" : accentColor,
                      } as any
                    } // Hack para forçar a cor via style inline na div interna se o componente permitir, senão usa classe padrão
                  />
                  {/* Fallback visual: O componente Progress do Shadcn usa 'bg-primary' por padrao. 
                      Se quiser colorir dinamicamente, o ideal é passar style para o Indicator ou usar classes.
                      Como o indicatorClassName aceita classes Tailwind, teríamos que ter classes dinâmicas (bg-red-500), 
                      o que é difícil com cores hex.
                      Para simplificar, deixamos o padrão verde/primary ou forçamos via style no Indicator se vc alterou o componente Progress para aceitar style.
                   */}
                </div>
              </div>

              <Button
                onClick={() => handleOpenTransaction(goal, "deposit")}
                className="w-full bg-white/5 hover:bg-[#CCFF00] hover:text-black text-white border border-white/10"
              >
                <TrendingUp className="w-4 h-4 mr-2" /> Adicionar Valor
              </Button>
            </div>
          );
        })}
      </div>

      {/* MODAL CRIAR/EDITAR */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGoal ? "Editar Meta" : "Nova Meta"}
            </DialogTitle>
            <DialogDescription>
              Defina seu objetivo financeiro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Objetivo</Label>
              <Input
                placeholder="Ex: Viagem Japão"
                className="bg-black/40 border-white/10 text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição (Opcional)</Label>
              <Textarea
                placeholder="Detalhes sobre este sonho..."
                className="bg-black/40 border-white/10 text-white resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Alvo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-black/40 border-white/10 text-white"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Data Alvo</Label>
                <Input
                  type="date"
                  className="bg-black/40 border-white/10 text-white"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            {/* SELEÇÃO DE CATEGORIA */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  {categories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Crie categorias de despesa primeiro
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSaveGoal}
              className="w-full bg-[#CCFF00] text-black font-bold mt-2"
            >
              Salvar Meta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DEPOSITAR/SACAR */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>
              {transactionType === "deposit"
                ? "Guardar Dinheiro"
                : "Resgatar Valor"}
            </DialogTitle>
            <DialogDescription>{selectedGoal?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                autoFocus
                type="number"
                placeholder="0.00"
                className="bg-black/40 border-white/10 text-white text-lg"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
              />
            </div>

            {transactionType === "deposit" && (
              <p className="text-xs text-white/50 bg-white/5 p-2 rounded border border-white/5">
                Isso criará automaticamente uma despesa de{" "}
                <strong>{selectedGoal?.category}</strong> no seu histórico.
              </p>
            )}

            <Button
              onClick={handleConfirmTransaction}
              className="w-full bg-[#CCFF00] text-black font-bold"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
