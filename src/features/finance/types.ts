export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO string
  createdAt: any; // Timestamp do Firestore
  cardId?: string;
}

export interface Goal {
  id?: string;
  userId?: string;
  name: string;
  description?: string;
  targetAmount: number; // Quanto quer juntar
  currentAmount: number; // Quanto já tem
  deadline?: string; // Data alvo (opcional)
  category?: string; // Para ícone/cor
  createdAt?: string;
}

export interface CreditCard {
  id?: string;
  userId?: string;
  name: string;
  limit: number; // Limite Total
  currentInvoice: number; // Fatura Atual
  closingDay: number; // Dia que fecha a fatura (melhor dia de compra)
  dueDay: number; // Dia do vencimento
  color: string; // Cor do cartão (Ex: Roxo pro Nubank)
  brand?: string; // Visa, Mastercard (Opcional, para ícone)
  installmentsBalance: number; // Valor preso em parcelas FUTURAS
}
