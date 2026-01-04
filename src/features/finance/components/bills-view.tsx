import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  Edit2,
  CheckCircle2,
  Power,
  Search,
  X,
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
import { getIconComponent } from "@/lib/icons";

const getLocalToday = () => {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split("T")[0];
};

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

  // Dados
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // UI
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
    date: getLocalToday(),
    refMonth: format(new Date(), "MMMM", { locale: ptBR }),
  });

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const unsubBills = BillService.subscribeToBills((data) => {
      if (isMounted) setBills(data);
    });
    const unsubTrans = TransactionService.subscribeToTransactions((data) => {
      if (isMounted) setRecentTransactions(data.slice(0, 50));
    });
    const fetchCats = async () => {
      try {
        const cats = await CategoryService.getCategories();
        if (isMounted)
          setCategories((cats || []).filter((c) => c.type === "expense"));
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

  const checkIsPaid = (bill: Bill) => {
    const currentMonthName = format(new Date(), "MMMM", {
      locale: ptBR,
    }).toLowerCase();
    return recentTransactions.some((t) => {
      const isSameCategory = t.category === bill.category;
      const desc = t.description.toLowerCase();
      const hasMonthRef = desc.includes(currentMonthName);
      const isPayment =
        desc.includes("pgto") || desc.includes(bill.name.toLowerCase());
      return isSameCategory && hasMonthRef && isPayment;
    });
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const isPaid = checkIsPaid(bill);
      const matchesSearch = bill.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || bill.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = bill.active;
      if (statusFilter === "inactive") matchesStatus = !bill.active;
      if (statusFilter === "paid") matchesStatus = bill.active && isPaid;
      if (statusFilter === "unpaid") matchesStatus = bill.active && !isPaid;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [bills, searchTerm, statusFilter, categoryFilter, recentTransactions]);

  // Handlers
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
    if (!formData.name || !formData.amount) return;
    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      category: formData.category,
    };
    if (editingBill) await BillService.updateBill(editingBill.id, payload);
    else await BillService.addBill(payload);
    setIsEditModalOpen(false);
  };
  const handleToggleActive = async (bill: Bill) => {
    await BillService.toggleActive(bill.id, bill.active);
  };
  const handleDelete = async (id: string) => {
    if (confirm("Excluir?")) await BillService.deleteBill(id);
  };
  const handleOpenPay = (bill: Bill) => {
    const currentMonth = format(new Date(), "MMMM", { locale: ptBR });
    const capitalizedMonth =
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
    setPayData({
      billId: bill.id,
      amount: bill.amount.toString(),
      date: getLocalToday(),
      refMonth: capitalizedMonth,
    });
    setIsPayModalOpen(true);
  };
  const handleConfirmPay = async () => {
    const bill = bills.find((b) => b.id === payData.billId);
    await TransactionService.addTransaction({
      description: `Pgto ${bill?.name} - ${payData.refMonth}`,
      amount: parseFloat(payData.amount),
      type: "expense",
      category: bill?.category || "",
      date: payData.date,
    });
    await BillService.markAsPaid(payData.billId, payData.date);
    setIsPayModalOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };
  const hasFilters =
    searchTerm || statusFilter !== "all" || categoryFilter !== "all";

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

      <div className="p-4 glass rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
            <Input
              placeholder="Buscar conta..."
              className="pl-9 bg-black/20 border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-black/40 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="paid">Pagas (Mês)</SelectItem>
                <SelectItem value="unpaid">A Pagar (Mês)</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] bg-black/40 border-white/10 text-white">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBills.length === 0 && (
          <div className="col-span-full text-center py-12 glass rounded-2xl border border-white/10">
            <p className="text-white/40">Nenhuma conta encontrada.</p>
          </div>
        )}

        {filteredBills.map((bill) => {
          // --- LOGICA DOS ICONES AQUI ---
          const isPaid = checkIsPaid(bill);

          // 1. Busca a categoria completa pelo nome
          const billCategory = categories.find((c) => c.name === bill.category);
          // 2. Busca o componente do ícone usando sua lib
          const Icon = getIconComponent(billCategory?.icon || "DollarSign");
          // 3. Pega a cor
          const color = billCategory?.color || "#FFFFFF";

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
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors border border-white/5"
                  )}
                  style={{
                    // Se estiver pago, usa verde. Se não, usa a cor da categoria
                    backgroundColor: isPaid ? "#CCFF0020" : `${color}20`,
                    color: isPaid ? "#CCFF00" : color,
                  }}
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

      {/* --- MODAIS (Cópia idêntica aos seus anteriores) --- */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBill ? "Editar" : "Criar"}</DialogTitle>
            <DialogDescription>Detalhes da conta.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
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
                <Label>Dia</Label>
                <Input
                  type="number"
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
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSaveBill}
              className="w-full bg-[#CCFF00] text-black font-bold"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Pagar</DialogTitle>
            <DialogDescription>Confirmar pagamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-xl text-center">
              <span className="text-2xl font-bold text-white">
                {parseFloat(payData.amount).toLocaleString("pt-BR", {
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
              <Label>Valor</Label>
              <Input
                type="number"
                className="bg-black/40 border-white/10 text-white"
                value={payData.amount}
                onChange={(e) =>
                  setPayData({ ...payData, amount: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Mês Ref</Label>
              <Select
                value={payData.refMonth}
                onValueChange={(v) => setPayData({ ...payData, refMonth: v })}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white h-[200px]">
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleConfirmPay}
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
