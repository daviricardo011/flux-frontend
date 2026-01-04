import { useState, useEffect } from "react";
import { Plus, DollarSign, AlignLeft, Loader2 } from "lucide-react";

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

// Features & Services
import { BalanceHeader } from "@/features/finance/components/balance-header";
import { TransactionList } from "@/features/finance/components/transaction-list";
import { TransactionTable } from "@/features/finance/components/transaction-table";
import { TransactionService } from "@/services/transaction-service";
import { CategoryService, type Category } from "@/services/category-service";
import type { Transaction, TransactionType } from "@/features/finance/types";
import { useAuth } from "@/features/auth/auth";
import { BillsView } from "@/features/finance/components/bills-view";

// --- HELPERS ---
// Garante a data local correta (YYYY-MM-DD) sem problemas de fuso
const getLocalToday = () => {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split("T")[0];
};

export function FinancePage() {
  const { user } = useAuth();

  // Estado Global
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado das Abas
  const [activeTab, setActiveTab] = useState("transactions");
  const [view, setView] = useState<"list" | "table">("list");

  // Estado do Modal de Nova Transação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado do Formulário (Inicializado com data local correta)
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "expense" as TransactionType,
    category: "",
    date: getLocalToday(), // <--- CORREÇÃO DE FUSO
  });

  // Carregar Dados (BLINDADO)
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    // Listener de Transações
    const unsubscribeTransactions = TransactionService.subscribeToTransactions(
      (data) => {
        if (isMounted) {
          setTransactions(data);
          setIsLoading(false);
        }
      }
    );

    // Busca de Categorias
    const fetchCats = async () => {
      try {
        const cats = await CategoryService.getCategories();
        if (isMounted) {
          setCategories(cats || []);
        }
      } catch (e) {
        console.error("Erro ao buscar categorias", e);
      }
    };

    fetchCats();

    // Limpeza ao desmontar
    return () => {
      isMounted = false;
      unsubscribeTransactions(); 
    };
  }, [user]);

  // Salvar Transação
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
    try {
      await TransactionService.addTransaction({
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        category: newTransaction.category,
        date: newTransaction.date,
      });

      // Reset do form (mantendo data local correta)
      setNewTransaction({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: getLocalToday(), // <--- CORREÇÃO DE FUSO
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = categories.filter(
    (cat) => cat.type === newTransaction.type
  );

  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-in fade-in duration-500">
      
      {/* 1. Header com Saldo e Gráfico */}
      <BalanceHeader transactions={transactions} />

      {/* 2. Sistema de Abas Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        {/* Cabeçalho das Abas */}
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

          {/* Controles da Aba de Transações (Só mostra se estiver na aba transactions) */}
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
                    <Plus className="w-4 h-4 mr-2" /> Nova Transação
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
                    {/* Botões de Tipo */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            type: "income",
                            category: "", // Limpa categoria ao trocar tipo
                            // Mantém a data selecionada (prev.date)
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
                            category: "", // Limpa categoria ao trocar tipo
                            // Mantém a data selecionada (prev.date)
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

                    {/* Descrição */}
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <div className="relative">
                        <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                        <Input
                            placeholder="Ex: Mercado, Salário..."
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

                    {/* Valor e Data */}
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

                    {/* Categoria */}
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
                                {categories.length === 0 
                                    ? "Crie categorias em Configurações" 
                                    : `Sem categorias de ${newTransaction.type === 'income' ? 'receita' : 'despesa'}`}
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
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="w-full bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold h-11"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Transação"
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Conteúdo da Aba 1: Transações */}
        <TabsContent value="transactions" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl border border-white/10">
              <DollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/50">Nenhuma movimentação ainda.</p>
            </div>
          ) : view === "list" ? (
            <TransactionList
              data={transactions}
              onDelete={TransactionService.deleteTransaction}
            />
          ) : (
            <TransactionTable data={transactions} />
          )}
        </TabsContent>

        {/* Conteúdo da Aba 2: Contas Fixas */}
        <TabsContent value="bills" className="mt-0">
          <BillsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}