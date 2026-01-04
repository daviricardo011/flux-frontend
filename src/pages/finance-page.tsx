 import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  DollarSign,
  AlignLeft,
  Loader2,
  Repeat,
  Check,
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  AlertTriangle, // Novo ícone para alerta
} from "lucide-react";

// UI Components
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Features & Services
import { BalanceHeader } from "@/features/finance/components/balance-header";
import { TransactionList } from "@/features/finance/components/transaction-list";
import { TransactionTable } from "@/features/finance/components/transaction-table";
import { TransactionService } from "@/services/transaction-service";
import { CategoryService, type Category } from "@/services/category-service";
import type { Transaction, TransactionType } from "@/features/finance/types";
import { useAuth } from "@/features/auth/auth";
import { BillsView } from "@/features/finance/components/bills-view";

const getLocalToday = () => {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split("T")[0];
};

export function FinancePage() {
  const { user } = useAuth();

  // Dados
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Seleção e Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<
    "category" | "date" | "amount" | "description"
  >("category"); // Removido "type" daqui
  const [bulkEditValue, setBulkEditValue] = useState("");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [filterMinVal, setFilterMinVal] = useState("");
  const [filterMaxVal, setFilterMaxVal] = useState("");

  // UI States
  const [activeTab, setActiveTab] = useState("transactions");
  const [view, setView] = useState<"list" | "table">("list");

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as TransactionType,
    category: "",
    date: getLocalToday(),
  });

  // Carregar Dados
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const unsubscribeTransactions = TransactionService.subscribeToTransactions(
      (data) => {
        if (isMounted) {
          setTransactions(data);
          setIsLoading(false);
        }
      }
    );

    const fetchCats = async () => {
      try {
        const cats = await CategoryService.getCategories();
        if (isMounted) setCategories(cats || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();

    return () => {
      isMounted = false;
      unsubscribeTransactions();
    };
  }, [user]);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesCategory =
        filterCategory === "all" || t.category === filterCategory;
      const matchesDateStart = !filterDateStart || t.date >= filterDateStart;
      const matchesDateEnd = !filterDateEnd || t.date <= filterDateEnd;
      const matchesMinVal =
        !filterMinVal || Number(t.amount) >= Number(filterMinVal);
      const matchesMaxVal =
        !filterMaxVal || Number(t.amount) <= Number(filterMaxVal);
      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesDateStart &&
        matchesDateEnd &&
        matchesMinVal &&
        matchesMaxVal
      );
    });
  }, [
    transactions,
    searchTerm,
    filterType,
    filterCategory,
    filterDateStart,
    filterDateEnd,
    filterMinVal,
    filterMaxVal,
  ]);

  // --- LÓGICA DE SELEÇÃO E VALIDAÇÃO DE TIPOS ---

  // Recupera os objetos completos das transações selecionadas
  const selectedTransactions = useMemo(() => {
    return transactions.filter((t) => selectedIds.includes(t.id!));
  }, [transactions, selectedIds]);

  // Verifica se há tipos misturados na seleção (Ex: Receita E Despesa juntos)
  const hasMixedTypes = useMemo(() => {
    if (selectedTransactions.length === 0) return false;
    const firstType = selectedTransactions[0].type;
    return !selectedTransactions.every((t) => t.type === firstType);
  }, [selectedTransactions]);

  // Define qual lista de categorias mostrar no Bulk Edit
  // Se não for misto, pega o tipo do primeiro item. Se for misto, array vazio.
  const bulkEditCategories = useMemo(() => {
    if (hasMixedTypes || selectedTransactions.length === 0) return [];
    const type = selectedTransactions[0].type;
    return categories.filter((c) => c.type === type);
  }, [hasMixedTypes, selectedTransactions, categories]);

  // --- HANDLERS ---
  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTransactions.map((t) => t.id!));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (
      confirm(`Tem certeza que deseja excluir ${selectedIds.length} itens?`)
    ) {
      await TransactionService.deleteMany(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkEditValue) return alert("Selecione um valor");

    setIsSubmitting(true);
    try {
      const updates: any = {};
      if (bulkEditField === "amount")
        updates[bulkEditField] = parseFloat(bulkEditValue);
      else updates[bulkEditField] = bulkEditValue;

      await TransactionService.updateMany(selectedIds, updates);
      setIsBulkEditOpen(false);
      setSelectedIds([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "",
      date: getLocalToday(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setEditingId(transaction.id!);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.description || !formData.amount || !formData.category)
      return alert("Preencha todos os campos!");

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      const payload = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
      };

      if (editingId) {
        await TransactionService.updateTransaction(editingId, payload);
        setIsModalOpen(false);
      } else {
        await TransactionService.addTransaction(payload);
        if (keepOpen) {
          setFormData((prev) => ({ ...prev, description: "", amount: "" }));
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2500);
        } else {
          setFormData({
            description: "",
            amount: "",
            type: "expense",
            category: "",
            date: getLocalToday(),
          });
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Categorias para o modal individual
  const availableCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  // Categorias para o filtro da tela
  const filterCategoriesList = categories.filter(
    (cat) => filterType === "all" || cat.type === filterType
  );

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterDateStart("");
    setFilterDateEnd("");
    setFilterMinVal("");
    setFilterMaxVal("");
  };

  const hasActiveFilters =
    searchTerm ||
    filterType !== "all" ||
    filterCategory !== "all" ||
    filterDateStart ||
    filterDateEnd ||
    filterMinVal ||
    filterMaxVal;

  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-in fade-in duration-500">
      <BalanceHeader transactions={transactions} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <TabsList className="glass w-full md:w-auto p-1 border border-white/10 h-auto">
            <TabsTrigger
              value="transactions"
              className="px-6 py-2 rounded-lg data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black font-medium transition-all"
            >
              Movimentações
            </TabsTrigger>
            <TabsTrigger
              value="bills"
              className="px-6 py-2 rounded-lg data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black font-medium transition-all"
            >
              Contas Fixas
            </TabsTrigger>
          </TabsList>

          {activeTab === "transactions" && (
            <div className="flex gap-2 w-full md:w-auto">
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "list" | "table")}
                className="mr-2"
              >
                <TabsList className="glass border border-white/10">
                  <TabsTrigger value="list">Lista</TabsTrigger>
                  <TabsTrigger value="table">Tabela</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                onClick={handleOpenCreate}
                className="flex-1 md:flex-none bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold transition-transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" /> Nova
              </Button>
            </div>
          )}
        </div>

        {activeTab === "transactions" && (
          <div className="mb-6 p-4 glass rounded-xl border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Buscar por título..."
                  className="pl-9 bg-black/20 border-white/10 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`border-white/10 text-white hover:bg-white/5 ${
                      hasActiveFilters
                        ? "bg-[#CCFF00]/10 border-[#CCFF00]/30 text-[#CCFF00]"
                        : ""
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" /> Filtros{" "}
                    {hasActiveFilters && (
                      <span className="ml-1 w-2 h-2 rounded-full bg-[#CCFF00]" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 glass-heavy border-white/10 p-4"
                  align="end"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={filterType}
                        onValueChange={(val: any) => setFilterType(val)}
                      >
                        <SelectTrigger className="bg-black/40 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="income">Entradas</SelectItem>
                          <SelectItem value="expense">Saídas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger className="bg-black/40 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                          <SelectItem value="all">Todas</SelectItem>
                          {filterCategoriesList.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        className="bg-black/40 border-white/10 text-white h-9 text-xs"
                        value={filterDateStart}
                        onChange={(e) => setFilterDateStart(e.target.value)}
                      />
                      <Input
                        type="date"
                        className="bg-black/40 border-white/10 text-white h-9 text-xs"
                        value={filterDateEnd}
                        onChange={(e) => setFilterDateEnd(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="bg-black/40 border-white/10 text-white h-9 text-xs"
                        value={filterMinVal}
                        onChange={(e) => setFilterMinVal(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        className="bg-black/40 border-white/10 text-white h-9 text-xs"
                        value={filterMaxVal}
                        onChange={(e) => setFilterMaxVal(e.target.value)}
                      />
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        className="w-full text-red-400 h-8 text-xs"
                        onClick={clearFilters}
                      >
                        <X className="w-3 h-3 mr-1" /> Limpar
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <TabsContent value="transactions" className="mt-0 relative">
          {/* BARRA FLUTUANTE DE AÇÕES EM MASSA */}
          {selectedIds.length > 0 && (
            <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 glass-heavy border border-[#CCFF00]/30 rounded-full px-6 py-3 shadow-[0_0_50px_rgba(204,255,0,0.1)] flex items-center gap-4 animate-in slide-in-from-bottom-10">
              <span className="text-white font-bold text-sm whitespace-nowrap">
                {selectedIds.length} selecionados
              </span>
              <div className="h-6 w-px bg-white/20"></div>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-[#CCFF00] hover:bg-white/5"
                onClick={() => setIsBulkEditOpen(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white"
                onClick={() => setSelectedIds([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl border border-white/10">
              <DollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/50">
                {transactions.length === 0
                  ? "Nenhuma movimentação ainda."
                  : "Nenhum resultado."}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="link"
                  className="text-[#CCFF00]"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          ) : view === "list" ? (
            <TransactionList
              data={filteredTransactions}
              categories={categories}
              onDelete={TransactionService.deleteTransaction}
              onEdit={handleOpenEdit}
              selectedIds={selectedIds}
              onSelect={handleSelect}
            />
          ) : (
            <TransactionTable
              data={filteredTransactions}
              categories={categories}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onEdit={handleOpenEdit}
              onDelete={TransactionService.deleteTransaction}
            />
          )}
        </TabsContent>

        <TabsContent value="bills" className="mt-0">
          <BillsView />
        </TabsContent>
      </Tabs>

      {/* --- MODAL CRIAR / EDITAR (INDIVIDUAL) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              {editingId
                ? "Altere os dados abaixo."
                : "Preencha os dados abaixo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
              <Button
                type="button"
                disabled={!!editingId} // <--- BLOQUEIA TROCA DE TIPO NA EDIÇÃO
                variant="ghost"
                onClick={() =>
                  setFormData((p) => ({ ...p, type: "income", category: "" }))
                }
                className={`flex-1 transition-all ${
                  formData.type === "income"
                    ? "bg-[#CCFF00] text-black shadow-lg font-bold"
                    : "text-white/60"
                } ${!!editingId ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Receita
              </Button>
              <Button
                type="button"
                disabled={!!editingId} // <--- BLOQUEIA TROCA DE TIPO NA EDIÇÃO
                variant="ghost"
                onClick={() =>
                  setFormData((p) => ({ ...p, type: "expense", category: "" }))
                }
                className={`flex-1 transition-all ${
                  formData.type === "expense"
                    ? "bg-red-500 text-white shadow-lg font-bold"
                    : "text-white/60"
                } ${!!editingId ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Despesa
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                <Input
                  className="pl-9 bg-black/40 border-white/10 text-white"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                  <Input
                    type="number"
                    className="pl-9 bg-black/40 border-white/10 text-white"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  className="bg-black/40 border-white/10 text-white"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
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
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  {availableCategories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editingId && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="keepOpen"
                  checked={keepOpen}
                  onChange={(e) => setKeepOpen(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#CCFF00]"
                />
                <Label
                  htmlFor="keepOpen"
                  className="text-sm text-white/60 flex items-center gap-1"
                >
                  <Repeat className="w-3 h-3" /> Continuar adicionando
                </Label>
              </div>
            )}
          </div>
          {showSuccess && (
            <div className="mb-3 p-2 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center justify-center gap-2 text-[#CCFF00] text-sm">
              <Check className="w-4 h-4" /> Salvo com sucesso!
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-[#CCFF00] text-black font-bold"
          >
            {isSubmitting
              ? "Salvando..."
              : editingId
              ? "Salvar Alterações"
              : keepOpen
              ? "Salvar e Continuar"
              : "Salvar"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* --- MODAL EDIÇÃO EM MASSA (BULK) --- */}
      <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edição em Massa</DialogTitle>
            <DialogDescription>
              Alterando {selectedIds.length} itens selecionados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Campo para alterar</Label>
              <Select
                value={bulkEditField}
                onValueChange={(v: any) => {
                  setBulkEditField(v);
                  setBulkEditValue("");
                }}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="amount">Valor</SelectItem>
                  <SelectItem value="description">Descrição</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Novo Valor</Label>

              {bulkEditField === "category" ? (
                /* VALIDAÇÃO DE CATEGORIA MISTA */
                hasMixedTypes ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">
                      Você selecionou receitas e despesas juntas. Para alterar a
                      categoria em massa, selecione apenas itens do mesmo tipo.
                    </p>
                  </div>
                ) : (
                  <Select
                    value={bulkEditValue}
                    onValueChange={setBulkEditValue}
                  >
                    <SelectTrigger className="bg-black/40 border-white/10 text-white">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                      {bulkEditCategories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              ) : bulkEditField === "date" ? (
                <Input
                  type="date"
                  className="bg-black/40 border-white/10 text-white"
                  value={bulkEditValue}
                  onChange={(e) => setBulkEditValue(e.target.value)}
                />
              ) : (
                <Input
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="Digite o novo valor"
                  type={bulkEditField === "amount" ? "number" : "text"}
                  value={bulkEditValue}
                  onChange={(e) => setBulkEditValue(e.target.value)}
                />
              )}
            </div>

            <Button
              onClick={handleBulkUpdate}
              disabled={
                isSubmitting || (bulkEditField === "category" && hasMixedTypes)
              }
              className="w-full bg-[#CCFF00] text-black font-bold disabled:opacity-50"
            >
              Aplicar a todos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
