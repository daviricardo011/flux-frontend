"use client";

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
  DialogTrigger,
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

  // Dados Principais
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Filtro
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form Novo Item
  const [newTransaction, setNewTransaction] = useState({
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
        console.error("Erro ao buscar categorias", e);
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
      // 1. Filtro de Texto (Título)
      const matchesSearch = t.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 2. Filtro de Tipo (Entrada/Saída)
      const matchesType = filterType === "all" || t.type === filterType;

      // 3. Filtro de Categoria
      const matchesCategory =
        filterCategory === "all" || t.category === filterCategory;

      // 4. Filtro de Data
      const matchesDateStart = !filterDateStart || t.date >= filterDateStart;
      const matchesDateEnd = !filterDateEnd || t.date <= filterDateEnd;

      // 5. Filtro de Valor
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

  // Handlers de Ação
  const handleSave = async () => {
    if (
      !newTransaction.description ||
      !newTransaction.amount ||
      !newTransaction.category
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      await TransactionService.addTransaction({
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        category: newTransaction.category,
        date: newTransaction.date,
      });

      if (keepOpen) {
        setNewTransaction((prev) => ({ ...prev, description: "", amount: "" }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      } else {
        setNewTransaction({
          description: "",
          amount: "",
          type: "expense",
          category: "",
          date: getLocalToday(),
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = categories.filter(
    (cat) => cat.type === newTransaction.type
  );
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
        {/* Header das Abas e Botão Novo */}
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

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 md:flex-none bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold transition-transform hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" /> Nova
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Movimentação</DialogTitle>
                    <DialogDescription className="text-white/50">
                      Preencha os dados abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-4">
                    {/* ... (Conteúdo do Modal Mantido Igual) ... */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            type: "income",
                            category: "",
                          }))
                        }
                        className={`flex-1 transition-all ${
                          newTransaction.type === "income"
                            ? "bg-[#CCFF00] text-black shadow-lg font-bold"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        Receita
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            type: "expense",
                            category: "",
                          }))
                        }
                        className={`flex-1 transition-all ${
                          newTransaction.type === "expense"
                            ? "bg-red-500 text-white shadow-lg font-bold"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        Despesa
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <div className="relative">
                        <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                        <Input
                          placeholder="Ex: Mercado"
                          className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/20"
                          value={newTransaction.description}
                          onChange={(e) =>
                            setNewTransaction({
                              ...newTransaction,
                              description: e.target.value,
                            })
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
                            placeholder="0.00"
                            className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/20"
                            value={newTransaction.amount}
                            onChange={(e) =>
                              setNewTransaction({
                                ...newTransaction,
                                amount: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input
                          type="date"
                          className="bg-black/40 border-white/10 text-white"
                          value={newTransaction.date}
                          onChange={(e) =>
                            setNewTransaction({
                              ...newTransaction,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(val) =>
                          setNewTransaction({
                            ...newTransaction,
                            category: val,
                          })
                        }
                      >
                        <SelectTrigger className="bg-black/40 border-white/10 text-white">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                          {availableCategories.length === 0 ? (
                            <SelectItem value="none" disabled>
                              Sem categorias
                            </SelectItem>
                          ) : (
                            availableCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="keepOpen"
                        checked={keepOpen}
                        onChange={(e) => setKeepOpen(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#CCFF00] cursor-pointer"
                      />
                      <Label
                        htmlFor="keepOpen"
                        className="text-sm font-normal text-white/60 cursor-pointer select-none flex items-center gap-1"
                      >
                        <Repeat className="w-3 h-3" /> Continuar adicionando
                        itens
                      </Label>
                    </div>
                  </div>
                  {showSuccess && (
                    <div className="mb-3 p-2 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center justify-center gap-2 text-[#CCFF00] text-sm animate-in fade-in slide-in-from-bottom-2">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Salvo com sucesso!</span>
                    </div>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="w-full bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold h-11"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Salvando...
                      </>
                    ) : keepOpen ? (
                      "Salvar e Continuar"
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* --- ÁREA DE FILTROS --- */}
        {activeTab === "transactions" && (
          <div className="mb-6 p-4 glass rounded-xl border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca Texto */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Buscar por título..."
                  className="pl-9 bg-black/20 border-white/10 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Botão de Filtros Avançados (Popover) */}
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
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros{" "}
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
                      <Label className="text-white/70">Tipo</Label>
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
                      <Label className="text-white/70">Categoria</Label>
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
                      <div className="space-y-2">
                        <Label className="text-white/70 text-xs">De</Label>
                        <Input
                          type="date"
                          className="bg-black/40 border-white/10 text-white h-9 text-xs"
                          value={filterDateStart}
                          onChange={(e) => setFilterDateStart(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/70 text-xs">Até</Label>
                        <Input
                          type="date"
                          className="bg-black/40 border-white/10 text-white h-9 text-xs"
                          value={filterDateEnd}
                          onChange={(e) => setFilterDateEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-white/70 text-xs">
                          Valor Mín.
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-black/40 border-white/10 text-white h-9 text-xs"
                          value={filterMinVal}
                          onChange={(e) => setFilterMinVal(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/70 text-xs">
                          Valor Máx.
                        </Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="bg-black/40 border-white/10 text-white h-9 text-xs"
                          value={filterMaxVal}
                          onChange={(e) => setFilterMaxVal(e.target.value)}
                        />
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 text-xs"
                        onClick={clearFilters}
                      >
                        <X className="w-3 h-3 mr-1" /> Limpar Filtros
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Chips de Filtro Ativo (Opcional - Visualização Rápida) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {filterType !== "all" && (
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                    Tipo: {filterType === "income" ? "Receita" : "Despesa"}
                  </span>
                )}
                {filterCategory !== "all" && (
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                    Cat: {filterCategory}
                  </span>
                )}
                {(filterDateStart || filterDateEnd) && (
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                    Data: {filterDateStart || "..."} a {filterDateEnd || "..."}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#CCFF00] hover:underline ml-auto"
                >
                  Limpar tudo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da Aba 1: Transações */}
        <TabsContent value="transactions" className="mt-0">
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
                  : "Nenhum resultado para os filtros."}
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
            />
          ) : (
            <TransactionTable
              data={filteredTransactions}
              categories={categories}
            />
          )}
        </TabsContent>

        <TabsContent value="bills" className="mt-0">
          <BillsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
