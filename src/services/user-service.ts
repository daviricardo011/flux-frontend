import { auth, db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const UserService = {
  getUserData: async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  },

  updatePreferences: async (preferences: Record<string, boolean>) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { preferences }, { merge: true });
  },

  updateProfile: async (displayName: string): Promise<void> => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      await updateProfile(user, {
        displayName: displayName,
      });
    } catch (error) {
      console.error("Erro no UserService.updateProfile:", error);
      throw error;
    }
  },
};
