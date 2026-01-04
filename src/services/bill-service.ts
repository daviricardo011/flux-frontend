import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string; // Dia do vencimento (ex: "10")
  category: string;
  active: boolean; // Ativa ou Inativa
  lastPaidDate?: string; // Para controle visual (opcional)
}

export const BillService = {
  // 1. LISTAR (Realtime)
  subscribeToBills: (callback: (bills: Bill[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, "bills"),
      where("userId", "==", user.uid),
      orderBy("dueDate", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bill[];
      callback(data);
    });
  },

  // 2. ADICIONAR
  addBill: async (bill: Omit<Bill, "id" | "userId" | "active">) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    await addDoc(collection(db, "bills"), {
      ...bill,
      userId: user.uid,
      active: true, // Padrão ativa
    });
  },

  // 3. ATUALIZAR (Editar dados)
  updateBill: async (id: string, updates: Partial<Bill>) => {
    const docRef = doc(db, "bills", id);
    await updateDoc(docRef, updates);
  },

  // 4. ALTERAR STATUS (Ativar/Inativar)
  toggleActive: async (id: string, currentStatus: boolean) => {
    const docRef = doc(db, "bills", id);
    await updateDoc(docRef, { active: !currentStatus });
  },

  // 5. REGISTRAR PAGAMENTO (Atualiza apenas o metadado da conta, a transação é criada separadamente)
  markAsPaid: async (id: string, date: string) => {
    const docRef = doc(db, "bills", id);
    await updateDoc(docRef, { lastPaidDate: date });
  },

  // 6. DELETAR
  deleteBill: async (id: string) => {
    await deleteDoc(doc(db, "bills", id));
  },
};
