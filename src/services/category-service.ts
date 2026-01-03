import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
}

export const CategoryService = {
  subscribe: (userId: string, callback: (categories: Category[]) => void) => {
    const q = query(
      collection(db, "categories"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      callback(categories);
    });
  },

  add: async (category: Omit<Category, "id">) => {
    await addDoc(collection(db, "categories"), category);
  },

  update: async (id: string, updates: Partial<Category>) => {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, updates);
  },

  delete: async (id: string) => {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  },
};
