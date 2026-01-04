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
