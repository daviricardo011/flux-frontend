import { useState, useEffect } from "react";
import {
  CreditCard,
  Wifi,
  Zap,
  Home,
  Phone,
  Tv,
  Plus,
  Trash2,
  Calendar,
  Edit2,
  CheckCircle2,
  Power,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Services & Components
import { TransactionService } from "@/services/transaction-service";
import { CategoryService, type Category } from "@/services/category-service";
import { useAuth } from "@/features/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillService, type Bill } from "@/services/bill-service";
import type { Transaction } from "@/features/finance/types";

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("netflix") || n.includes("tv") || n.includes("stream"))
    return Tv;
  if (n.includes("internet") || n.includes("wifi")) return Wifi;
  if (n.includes("luz") || n.includes("energia") || n.includes("electric"))
    return Zap;
  if (n.includes("aluguel") || n.includes("casa") || n.includes("condominio"))
    return Home;
  if (
    n.includes("celular") ||
    n.includes("tim") ||
    n.includes("claro") ||
    n.includes("vivo")
  )
    return Phone;
  return CreditCard;
};

// Meses para o Select
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function BillsView() {
  const { user } = useAuth();

  // Estados de Dados
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  // Estados de UI
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Forms
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
  });
  const [payData, setPayData] = useState({
    billId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    refMonth: format(new Date(), "MMMM", { locale: ptBR }), // Padrão: Mês atual
  });

  // Carregamento de Dados (BLINDADO)
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    // 1. Carregar Contas
    const unsubBills = BillService.subscribeToBills((data) => {
      if (isMounted) setBills(data);
    });

    // 2. Carregar Transações (para verificar pagamentos)
    // Filtramos apenas as do mês atual/recente para não pesar
    const unsubTrans = TransactionService.subscribeToTransactions((data) => {
      if (isMounted) {
        // Pega transações dos últimos 60 dias para garantir
        const recent = data.slice(0, 50);
        setRecentTransactions(recent);
      }
    });

    // 3. Carregar Categorias
    const fetchCats = async () => {
      try {
        const cats = await CategoryService.getCategories();
        if (isMounted) {
          setCategories((cats || []).filter((c) => c.type === "expense"));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();

    return () => {
      isMounted = false;
      unsubBills();
      unsubTrans();
    };
  }, [user]);

  // Função para checar se está pago no mês atual
  const checkIsPaid = (bill: Bill) => {
    const currentMonthName = format(new Date(), "MMMM", {
      locale: ptBR,
    }).toLowerCase();

    // Procura uma transação que:
    // 1. Seja da mesma categoria da conta
    // 2. Tenha o nome da conta na descrição OU tenha o mês atual na descrição
    return recentTransactions.some((t) => {
      const isSameCategory = t.category === bill.category;
      const desc = t.description.toLowerCase();
      const hasMonthRef = desc.includes(currentMonthName);
      const isPayment =
        desc.includes("pgto") || desc.includes(bill.name.toLowerCase());

      // Lógica: É da mesma categoria E (tem o mês na descrição OU foi feito hoje)
      return isSameCategory && hasMonthRef && isPayment;
    });
  };

  // --- HANDLERS ---

  const handleOpenCreate = () => {
    setEditingBill(null);
    setFormData({ name: "", amount: "", dueDate: "", category: "" });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      category: bill.category,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveBill = async () => {
    if (
      !formData.name ||
      !formData.amount ||
      !formData.dueDate ||
      !formData.category
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      const payload = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
      };
      if (editingBill) {
        await BillService.updateBill(editingBill.id, payload);
      } else {
        await BillService.addBill(payload);
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = async (bill: Bill) => {
    await BillService.toggleActive(bill.id, bill.active);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta conta?")) await BillService.deleteBill(id);
  };

  // Abrir modal de pagamento com mês atual pré-selecionado (Capitalizado)
  const handleOpenPay = (bill: Bill) => {
    const currentMonth = format(new Date(), "MMMM", { locale: ptBR });
    const capitalizedMonth =
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

    setPayData({
      billId: bill.id,
      amount: bill.amount.toString(),
      date: new Date().toISOString().split("T")[0],
      refMonth: capitalizedMonth,
    });
    setIsPayModalOpen(true);
  };

  const handleConfirmPay = async () => {
    const bill = bills.find((b) => b.id === payData.billId);
    if (!bill) return;

    try {
      // Cria a transação com formato padrão para ser detectada depois
      await TransactionService.addTransaction({
        description: `Pgto ${bill.name} - ${payData.refMonth}`,
        amount: parseFloat(payData.amount),
        type: "expense",
        category: bill.category,
        date: payData.date,
      });

      // Atualiza data do último pagamento na conta (opcional, mas bom pra cache visual)
      await BillService.markAsPaid(bill.id, payData.date);
      setIsPayModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar pagamento.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-white">
          Contas Fixas & Assinaturas
        </h3>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.length === 0 && (
          <div className="col-span-full text-center py-12 glass rounded-2xl border border-white/10">
            <p className="text-white/40">Nenhuma conta cadastrada.</p>
          </div>
        )}

        {bills.map((bill) => {
          const Icon = getIcon(bill.name);
          const isPaid = checkIsPaid(bill);

          return (
            <div
              key={bill.id}
              className={cn(
                "glass rounded-2xl p-6 border transition-all duration-300 relative group overflow-hidden",
                !bill.active && "opacity-60 grayscale",
                isPaid && bill.active
                  ? "border-[#CCFF00]/30 bg-[#CCFF00]/5"
                  : "border-white/10"
              )}
            >
              {!bill.active && (
                <div className="absolute top-0 right-0 bg-white/10 text-white/60 text-xs px-2 py-1 rounded-bl-lg">
                  INATIVA
                </div>
              )}

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isPaid
                      ? "bg-[#CCFF00]/20 text-[#CCFF00]"
                      : "bg-white/10 text-white"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/40 hover:text-white"
                    onClick={() => handleOpenEdit(bill)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-8 w-8",
                      bill.active
                        ? "text-[#CCFF00]/50 hover:text-[#CCFF00]"
                        : "text-white/20 hover:text-white"
                    )}
                    onClick={() => handleToggleActive(bill)}
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/20 hover:text-red-500"
                    onClick={() => handleDelete(bill.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="text-lg font-bold text-white truncate">
                  {bill.name}
                </h3>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Dia {bill.dueDate}
                    </p>
                    <p className="text-xs text-white/40 capitalize">
                      {bill.category}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {bill.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              {bill.active && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  {isPaid ? (
                    <Button
                      variant="outline"
                      className="w-full border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10 bg-[#CCFF00]/5 cursor-default"
                      disabled
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Pago este mês
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOpenPay(bill)}
                      className="w-full bg-white/5 hover:bg-[#CCFF00] hover:text-black text-white transition-all border border-white/10"
                    >
                      Pagar Agora
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- MODAL CRIAR/EDITAR --- */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingBill ? "Editar Conta" : "Nova Conta Fixa"}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Configure os detalhes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Ex: Aluguel"
                className="bg-black/40 border-white/10 text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input
                  type="number"
                  className="bg-black/40 border-white/10 text-white"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Input
                  type="number"
                  placeholder="Dia"
                  className="bg-black/40 border-white/10 text-white"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
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
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSaveBill}
              className="w-full bg-[#CCFF00] text-black font-bold mt-4"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL PAGAR --- */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription className="text-white/50">
              Lançar despesa no financeiro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-xl text-center mb-2">
              <span className="block text-xs text-[#CCFF00] uppercase tracking-wider">
                Valor
              </span>
              <span className="text-2xl font-bold text-white">
                {parseFloat(payData.amount || "0").toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                className="bg-black/40 border-white/10 text-white"
                value={payData.date}
                onChange={(e) =>
                  setPayData({ ...payData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Final</Label>
              <Input
                type="number"
                className="bg-black/40 border-white/10 text-white"
                value={payData.amount}
                onChange={(e) =>
                  setPayData({ ...payData, amount: e.target.value })
                }
              />
            </div>

            {/* SELECT DE MÊS DE REFERÊNCIA */}
            <div className="space-y-2">
              <Label>Mês de Referência</Label>
              <Select
                value={payData.refMonth}
                onValueChange={(val) =>
                  setPayData({ ...payData, refMonth: val })
                }
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white h-[200px]">
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleConfirmPay}
              className="w-full bg-[#CCFF00] text-black font-bold mt-4"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
