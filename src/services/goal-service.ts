import { 
  collection, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, updateDoc 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { type Goal } from "@/features/finance/types";

export const GoalService = {
  // Escutar Metas
  subscribeToGoals: (callback: (goals: Goal[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, "goals"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[];
      callback(goals);
    });
  },

  // Adicionar Meta
  addGoal: async (goal: Omit<Goal, "id" | "userId" | "createdAt" | "currentAmount">) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    await addDoc(collection(db, "goals"), {
      ...goal,
      currentAmount: 0, // Começa com 0
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });
  },

  // Atualizar Meta (Editar nome, alvo, etc)
  updateGoal: async (id: string, updates: Partial<Goal>) => {
    const docRef = doc(db, "goals", id);
    await updateDoc(docRef, updates);
  },

  // Adicionar Dinheiro (Depósito)
  addMoney: async (id: string, currentAmount: number, amountToAdd: number) => {
    const docRef = doc(db, "goals", id);
    await updateDoc(docRef, {
      currentAmount: currentAmount + amountToAdd
    });
  },

  // Remover Dinheiro (Saque)
  withdrawMoney: async (id: string, currentAmount: number, amountToWithdraw: number) => {
    const docRef = doc(db, "goals", id);
    const newAmount = Math.max(0, currentAmount - amountToWithdraw);
    await updateDoc(docRef, {
      currentAmount: newAmount
    });
  },

  deleteGoal: async (id: string) => {
    await deleteDoc(doc(db, "goals", id));
  },
};