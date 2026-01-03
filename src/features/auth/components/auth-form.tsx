"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthInput } from "./auth-input";
import { useAuth } from "../auth";
import { useNavigate } from "@tanstack/react-router";

const authSchema = {
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 letras"),
};

export function AuthForm() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);
      try {
        if (isLogin) {
          await auth.login(value.email, value.password);
        } else {
          await auth.register(value.email, value.password, value.name);
        }
        await navigate({ to: "/" });
      } catch (error: any) {
        console.error("Erro:", error);
        if (error.code === "auth/invalid-credential") {
          setGlobalError("Email ou senha incorretos.");
        } else if (error.code === "auth/email-already-in-use") {
          setGlobalError("Este e-mail já está cadastrado.");
        } else {
          setGlobalError("Falha ao autenticar.");
        }
      }
    },
  });

  return (
    <div className="space-y-6">
      {globalError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
        >
          {globalError}
        </motion.div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <AuthInput
                form={form}
                name="name"
                icon={User}
                placeholder="Nome Completo"
                validator={!isLogin ? authSchema.name : undefined}
              />
            </motion.div>
          )}

          <motion.div layout key="email-wrapper">
            <AuthInput
              form={form}
              name="email"
              icon={Mail}
              type="email"
              placeholder="Email"
              validator={authSchema.email}
            />
          </motion.div>

          <motion.div layout key="password-wrapper" className="relative">
            <AuthInput
              form={form}
              name="password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              validator={authSchema.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-6 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20 h-8 w-8 flex items-center justify-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-white/60 hover:text-[#CCFF00] transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-bold text-base glow-lime transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processando..."
                : isLogin
                ? "Entrar"
                : "Criar Conta"}
            </Button>
          )}
        />
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            form.reset();
            setGlobalError(null);
          }}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          {isLogin ? (
            <>
              Novo no Flux?{" "}
              <span className="text-[#CCFF00] font-medium hover:underline underline-offset-2">
                Criar conta
              </span>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <span className="text-[#CCFF00] font-medium hover:underline underline-offset-2">
                Acessar
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
