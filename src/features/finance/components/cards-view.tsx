"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  CreditCard as CardIcon,
  Trash2,
  Edit2,
  ShoppingBag,
  CheckCircle2,
  List,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FastForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addMonths,
  format,
  parseISO,
  isSameMonth,
  isAfter,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@/features/auth/auth";
import { CreditCardService } from "@/services/credit-card-service";
import { TransactionService } from "@/services/transaction-service";
import { CategoryService, type Category } from "@/services/category-service";
import { type CreditCard, type Transaction } from "@/features/finance/types";

const CARD_COLORS = [
  { name: "Roxo (Nubank)", value: "#820AD1" },
  { name: "Laranja (Inter)", value: "#FF7A00" },
  { name: "Vermelho (Santander/Bradesco)", value: "#CC0000" },
  { name: "Azul (Itaú/Caixa)", value: "#004990" },
  { name: "Preto (Black)", value: "#1a1a1a" },
  { name: "Verde (C6/Stone)", value: "#00A650" },
];

const getLocalToday = () => {
  const local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().split("T")[0];
};

interface CardsViewProps {
  transactions?: Transaction[];
}

export function CardsView({ transactions = [] }: CardsViewProps) {
  const { user } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Estados
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date());

  // Forms
  const [formData, setFormData] = useState({
    name: "",
    limit: "",
    closingDay: "",
    dueDay: "",
    color: "#1a1a1a",
  });
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    installments: "1",
    category: "Outros",
    date: getLocalToday(),
  });
  const [amountValue, setAmountValue] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsub = CreditCardService.subscribeToCards(setCards);
    CategoryService.getCategories().then((cats) => setCategories(cats || []));
    return () => unsub();
  }, [user]);

  // --- Lógica de Fatura ---
  const handleOpenInvoice = (card: CreditCard) => {
    setSelectedCard(card);
    setInvoiceDate(new Date());
    setIsInvoiceOpen(true);
  };

  const invoiceTransactions = useMemo(() => {
    if (!selectedCard) return [];
    return transactions.filter(
      (t) =>
        t.cardId === selectedCard.id &&
        isSameMonth(parseISO(t.date), invoiceDate)
    );
  }, [transactions, selectedCard, invoiceDate]);

  const invoiceTotal = invoiceTransactions.reduce(
    (acc, t) => acc + Number(t.amount),
    0
  );

  const isFutureInvoice = useMemo(() => {
    const today = new Date();
    return isAfter(startOfMonth(invoiceDate), startOfMonth(today));
  }, [invoiceDate]);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setSelectedCard(null);
    setFormData({
      name: "",
      limit: "",
      closingDay: "",
      dueDay: "",
      color: "#1a1a1a",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (card: CreditCard) => {
    setSelectedCard(card);
    setFormData({
      name: card.name,
      limit: card.limit.toString(),
      closingDay: card.closingDay.toString(),
      dueDay: card.dueDay.toString(),
      color: card.color,
    });
    setIsCreateOpen(true);
  };

  const handleSaveCard = async () => {
    if (
      !formData.name ||
      !formData.limit ||
      !formData.closingDay ||
      !formData.dueDay
    )
      return alert("Preencha todos os campos");

    const payload = {
      name: formData.name,
      limit: parseFloat(formData.limit),
      closingDay: parseInt(formData.closingDay),
      dueDay: parseInt(formData.dueDay),
      color: formData.color,
    };
    try {
      if (selectedCard)
        await CreditCardService.updateCard(selectedCard.id!, payload);
      else await CreditCardService.addCard(payload);
      setIsCreateOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenExpense = (card: CreditCard) => {
    setSelectedCard(card);
    setExpenseData({
      amount: "",
      description: "",
      installments: "1",
      category: "Outros",
      date: getLocalToday(),
    });
    setIsExpenseOpen(true);
  };

  const handleConfirmExpense = async () => {
    if (!selectedCard || !expenseData.amount || !expenseData.description)
      return alert("Preencha valor e descrição");

    const totalAmount = parseFloat(expenseData.amount);
    const installments = parseInt(expenseData.installments) || 1;
    const installmentValue = totalAmount / installments;
    const baseDate = new Date(expenseData.date);

    await CreditCardService.addExpense(
      selectedCard.id!,
      selectedCard.currentInvoice,
      selectedCard.installmentsBalance || 0,
      totalAmount,
      installments
    );

    for (let i = 0; i < installments; i++) {
      const date = addMonths(baseDate, i).toISOString().split("T")[0];

      // --- FORMATANDO O NOME CORRETAMENTE ---
      const itemDesc =
        installments > 1
          ? `${expenseData.description} (${i + 1}/${installments})`
          : expenseData.description;
      const fullDesc = `${itemDesc} - Cartão: ${selectedCard.name}`;

      await TransactionService.addTransaction({
        description: fullDesc, // Agora salva com o nome do cartão
        amount: installmentValue,
        type: "expense",
        category: expenseData.category,
        date: date,
        cardId: selectedCard.id,
      });
    }
    setIsExpenseOpen(false);
  };

  const handleOpenPay = (card: CreditCard) => {
    setSelectedCard(card);
    setAmountValue(card.currentInvoice.toString());
    setIsPayOpen(true);
  };

  const handleConfirmPay = async () => {
    if (!selectedCard || !amountValue) return;
    const value = parseFloat(amountValue);
    await CreditCardService.payInvoice(
      selectedCard.id!,
      selectedCard.currentInvoice,
      value
    );
    await TransactionService.addTransaction({
      description: `Fatura ${selectedCard.name}`,
      amount: value,
      type: "expense",
      category: "Cartão de Crédito",
      date: getLocalToday(),
    });
    setIsPayOpen(false);
  };

  // --- AÇÃO DE ADIANTAR ---
  const handleAnticipate = async (transaction: Transaction) => {
    if (!selectedCard) return;
    if (
      confirm(
        `Deseja adiantar a parcela "${transaction.description}" para a fatura atual?`
      )
    ) {
      try {
        await CreditCardService.anticipateInstallment(
          selectedCard.id!,
          transaction.id!,
          Number(transaction.amount),
          selectedCard,
          transaction.description // <--- PASSANDO DESCRIÇÃO ATUAL
        );
      } catch (e) {
        console.error("Erro ao adiantar:", e);
        alert("Erro ao adiantar parcela.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir cartão?")) await CreditCardService.deleteCard(id);
  };

  const formatMoney = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <CardIcon className="w-5 h-5 text-[#CCFF00]" /> Meus Cartões
        </h3>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Cartão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.length === 0 && (
          <div className="col-span-full text-center py-12 glass rounded-2xl border border-white/10">
            <p className="text-white/50">Nenhum cartão cadastrado.</p>
          </div>
        )}

        {cards.map((card) => {
          const totalUsed =
            card.currentInvoice + (card.installmentsBalance || 0);
          const usedPercentage = Math.min(100, (totalUsed / card.limit) * 100);
          const available = Math.max(0, card.limit - totalUsed);

          return (
            <div key={card.id} className="relative group perspective-1000">
              <div
                className="h-48 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-transform hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, #000000 100%)`,
                  boxShadow: `0 10px 30px -10px ${card.color}60`,
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-lg tracking-wide">
                    {card.name}
                  </span>
                  <CardIcon className="text-white/50 w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider">
                    Fatura Atual
                  </p>
                  <p className="text-white text-3xl font-bold">
                    {formatMoney(card.currentInvoice)}
                  </p>
                </div>
                <div className="flex justify-between items-end text-xs text-white/80">
                  <div>
                    <p>Disp: {formatMoney(available)}</p>
                    <p className="text-white/40">
                      Limite: {formatMoney(card.limit)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>Fecha dia {card.closingDay}</p>
                    <p>Vence dia {card.dueDay}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 px-1">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Limite usado (Total)</span>
                  <span>{usedPercentage.toFixed(0)}%</span>
                </div>
                <Progress
                  value={usedPercentage}
                  className="h-2 bg-white/10"
                  indicatorClassName={
                    usedPercentage > 90 ? "bg-red-500" : "bg-[#CCFF00]"
                  }
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 text-white text-xs"
                  onClick={() => handleOpenExpense(card)}
                >
                  <ShoppingBag className="w-3 h-3 mr-2" /> Comprar
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 bg-white/10 text-white hover:bg-white/20 text-xs"
                  onClick={() => handleOpenInvoice(card)}
                >
                  <List className="w-3 h-3 mr-2" /> Detalhes
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={() => handleOpenPay(card)}
                  title="Pagar Fatura"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white hover:bg-white/20"
                  onClick={() => handleOpenEdit(card)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white hover:bg-red-500/20 hover:text-red-500"
                  onClick={() => handleDelete(card.id!)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAIS (Cópia idêntica aos seus anteriores para economizar espaço visual, mas atualizados no código acima) --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCard ? "Editar" : "Novo"} Cartão</DialogTitle>
            <DialogDescription>Dados do cartão.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Nome"
              className="bg-black/40 border-white/10 text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Limite"
              className="bg-black/40 border-white/10 text-white"
              value={formData.limit}
              onChange={(e) =>
                setFormData({ ...formData, limit: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Dia Fechamento"
                className="bg-black/40 border-white/10 text-white"
                value={formData.closingDay}
                onChange={(e) =>
                  setFormData({ ...formData, closingDay: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Dia Vencimento"
                className="bg-black/40 border-white/10 text-white"
                value={formData.dueDay}
                onChange={(e) =>
                  setFormData({ ...formData, dueDay: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CARD_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c.value })}
                  className={cn(
                    "w-8 h-8 rounded-full border-2",
                    formData.color === c.value
                      ? "border-white scale-110"
                      : "border-transparent opacity-70"
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <Button
              onClick={handleSaveCard}
              className="w-full bg-[#CCFF00] text-black font-bold"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Nova Compra</DialogTitle>
            <DialogDescription>
              Adicionar ao {selectedCard?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Descrição"
              className="bg-black/40 border-white/10 text-white"
              value={expenseData.description}
              onChange={(e) =>
                setExpenseData({ ...expenseData, description: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="R$ Total"
                className="bg-black/40 border-white/10 text-white"
                value={expenseData.amount}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, amount: e.target.value })
                }
              />
              <Select
                value={expenseData.installments}
                onValueChange={(v) =>
                  setExpenseData({ ...expenseData, installments: v })
                }
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white h-48">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              className="bg-black/40 border-white/10 text-white"
              value={expenseData.date}
              onChange={(e) =>
                setExpenseData({ ...expenseData, date: e.target.value })
              }
            />
            <Select
              value={expenseData.category}
              onValueChange={(v) =>
                setExpenseData({ ...expenseData, category: v })
              }
            >
              <SelectTrigger className="bg-black/40 border-white/10 text-white">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleConfirmExpense}
              className="w-full bg-[#CCFF00] text-black font-bold"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Pagar Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="number"
              className="bg-black/40 border-white/10 text-white text-2xl"
              value={amountValue}
              onChange={(e) => setAmountValue(e.target.value)}
            />
            <Button
              onClick={handleConfirmPay}
              className="w-full bg-[#CCFF00] text-black font-bold"
            >
              Pagar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE DETALHES DA FATURA COM ADIANTAMENTO --- */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="glass-heavy border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#CCFF00]" />
              Fatura de {selectedCard?.name}
            </DialogTitle>
            <DialogDescription>
              Visualize os lançamentos por mês.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInvoiceDate((prev) => addMonths(prev, -1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-bold text-lg capitalize">
                {format(invoiceDate, "MMMM yyyy", { locale: ptBR })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInvoiceDate((prev) => addMonths(prev, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {invoiceTransactions.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  Nenhuma compra neste mês.
                </div>
              ) : (
                invoiceTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5 group"
                  >
                    <div>
                      <p className="font-medium text-white">{t.description}</p>
                      <p className="text-xs text-white/50">
                        {format(parseISO(t.date), "dd/MM")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">
                        {formatMoney(Number(t.amount))}
                      </span>

                      {/* Botão de Adiantar - Só aparece se a fatura for Futura */}
                      {isFutureInvoice && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-[#CCFF00]/50 hover:text-[#CCFF00] hover:bg-[#CCFF00]/10"
                                onClick={() => handleAnticipate(t)}
                              >
                                <FastForward className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black border-white/10 text-white">
                              <p>Adiantar para fatura atual</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-white/60">Total da Fatura</span>
              <span className="text-2xl font-bold text-[#CCFF00]">
                {formatMoney(invoiceTotal)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
