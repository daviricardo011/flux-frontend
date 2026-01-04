import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { Transaction } from "@/features/finance/types";

export const TransactionService = {
  // ESCUTAR TRANSAÇÕES (Realtime)
  subscribeToTransactions: (
    callback: (transactions: Transaction[]) => void
  ) => {
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

  // ADICIONAR
  addTransaction: async (
    transaction: Omit<Transaction, "id" | "userId" | "createdAt">
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    await addDoc(collection(db, "transactions"), {
      ...transaction,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });
  },

  // ATUALIZAR UM (Novo)
  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    const docRef = doc(db, "transactions", id);
    await updateDoc(docRef, updates);
  },

  // EXCLUIR UM
  deleteTransaction: async (id: string) => {
    await deleteDoc(doc(db, "transactions", id));
  },

  // EXCLUIR VÁRIOS (Novo)
  deleteMany: async (ids: string[]) => {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, "transactions", id);
      batch.delete(docRef);
    });
    await batch.commit();
  },

  // ATUALIZAR VÁRIOS (Novo)
  updateMany: async (ids: string[], updates: Partial<Transaction>) => {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, "transactions", id);
      batch.update(docRef, updates);
    });
    await batch.commit();
  },
};
