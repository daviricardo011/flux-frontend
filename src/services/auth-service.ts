import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { User } from "@/features/auth/auth";

const handleFirebaseError = (error: any) => {
  console.error("Auth Service Error:", error);
  if (error.code === "auth/invalid-credential")
    throw new Error("E-mail ou senha incorretos.");
  if (error.code === "auth/email-already-in-use")
    throw new Error("Este e-mail já está em uso.");
  throw error;
};

const mapUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "Usuário",
    email: firebaseUser.email || "",
    avatar: firebaseUser.photoURL || undefined,
  };
};

export const AuthService = {
  loginWithGoogle: async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      handleFirebaseError(error);
    }
  },

  loginWithEmail: async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleFirebaseError(error);
    }
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    } catch (error) {
      handleFirebaseError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      handleFirebaseError(error);
    }
  },
  mapUser,
};
