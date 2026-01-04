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