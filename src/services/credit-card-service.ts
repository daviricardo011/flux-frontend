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
import { type CreditCard } from "@/features/finance/types";

export const CreditCardService = {
  // Escutar Cartões
  subscribeToCards: (callback: (cards: CreditCard[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, "credit-cards"),
      where("userId", "==", user.uid)
    );

    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CreditCard[];
      callback(cards);
    });
  },

  // Adicionar Cartão
  addCard: async (
    card: Omit<
      CreditCard,
      "id" | "userId" | "currentInvoice" | "installmentsBalance"
    >
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    await addDoc(collection(db, "credit-cards"), {
      ...card,
      currentInvoice: 0,
      installmentsBalance: 0, // Inicia zerado
      userId: user.uid,
    });
  },

  // Atualizar Cartão
  updateCard: async (id: string, updates: Partial<CreditCard>) => {
    const docRef = doc(db, "credit-cards", id);
    await updateDoc(docRef, updates);
  },

  // Registrar Compra no Cartão (Aumenta Fatura)
  addExpense: async (
    id: string,
    currentInvoice: number,
    currentInstallmentsBalance: number,
    totalAmount: number,
    installments: number = 1
  ) => {
    const docRef = doc(db, "credit-cards", id);

    // Valor de CADA parcela
    const installmentValue = totalAmount / installments;

    // 1. A primeira parcela entra na fatura ATUAL
    const newInvoiceValue = currentInvoice + installmentValue;

    // 2. O restante (9 parcelas) entra no saldo PARCELADO
    // Se for a vista (1x), installmentsBalance não muda (total - total/1 = 0)
    const futureAmount = totalAmount - installmentValue;
    const newInstallmentsBalance = currentInstallmentsBalance + futureAmount;

    await updateDoc(docRef, {
      currentInvoice: newInvoiceValue,
      installmentsBalance: newInstallmentsBalance,
    });
  },

  // Pagar Fatura (Zera ou reduz Fatura)
  payInvoice: async (
    id: string,
    currentInvoice: number,
    amountPaid: number
  ) => {
    const docRef = doc(db, "credit-cards", id);
    // Se pagar tudo, zera. Se pagar parcial, sobra o resto.
    const newInvoiceValue = Math.max(0, currentInvoice - amountPaid);
    await updateDoc(docRef, {
      currentInvoice: newInvoiceValue,
    });
  },

  deleteCard: async (id: string) => {
    await deleteDoc(doc(db, "credit-cards", id));
  },

  anticipateInstallment: async (
    cardId: string,
    transactionId: string,
    amount: number,
    currentCardData: CreditCard,
    currentDescription: string // <--- RECEBE A DESCRIÇÃO ATUAL
  ) => {
    const batch = writeBatch(db);

    const cardRef = doc(db, "credit-cards", cardId);
    const transactionRef = doc(db, "transactions", transactionId);

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const dateStr = today.toISOString().split("T")[0];

    // Atualiza mantendo o nome original + tag (Adiantada)
    batch.update(transactionRef, {
      date: dateStr,
      description: `${currentDescription} (Adiantada)`,
    });

    const newInvoice = currentCardData.currentInvoice + amount;
    const newInstallments = Math.max(
      0,
      currentCardData.installmentsBalance - amount
    );

    batch.update(cardRef, {
      currentInvoice: newInvoice,
      installmentsBalance: newInstallments,
    });

    await batch.commit();
  },
};
