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
  getDocs,
} from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  userId: string;
  icon?: string;
  color?: string;
}

export const CategoryService = {
  // 1. ESCUTAR (Realtime)
  subscribeToCategories: (callback: (categories: Category[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, "categories"),
      where("userId", "==", user.uid)
    );

    return onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      callback(cats);
    });
  },

  // 2. BUSCAR UMA VEZ (Para selects)
  getCategories: async (): Promise<Category[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    const q = query(
      collection(db, "categories"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  },

  // 3. ADICIONAR
  addCategory: async (category: Omit<Category, "id" | "userId">) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    await addDoc(collection(db, "categories"), {
      ...category,
      userId: user.uid,
    });
  },

  // 4. ATUALIZAR (Estava faltando)
  updateCategory: async (id: string, updates: Partial<Category>) => {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, updates);
  },

  // 5. DELETAR
  deleteCategory: async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
  },
};
