import type { Transaction } from "@/features/finance/types";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export const TransactionService = {
  // Adicionar
  addTransaction: async (
    data: Omit<Transaction, "id" | "userId" | "createdAt">
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    await addDoc(collection(db, "transactions"), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
  },

  // Ler em Tempo Real
  subscribeToTransactions: (callback: (data: Transaction[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      callback(transactions);
    });
  },

  // Deletar
  deleteTransaction: async (id: string) => {
    await deleteDoc(doc(db, "transactions", id));
  },
};
