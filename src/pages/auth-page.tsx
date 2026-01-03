import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthForm } from "@/features/auth/components/auth-form";
import { SocialLogin } from "@/features/auth/components/social-login";
import { useAuth } from "@/features/auth/auth";
import { useNavigate } from "@tanstack/react-router";

export function AuthPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleGoogleLogin = async () => {
    try {
      await auth.loginWithGoogle();
      await navigate({ to: "/" });
    } catch (error) {
      console.error("Erro Google:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Animation Layer */}
      <div className="absolute inset-0 hidden md:block overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0"
        />
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 80% 20%, rgba(204, 255, 0, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 80%, rgba(204, 255, 0, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 40%, rgba(204, 255, 0, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(204, 255, 0, 0.08) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0"
        />
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "relative w-full max-w-md z-10",
          "md:translate-y-0",
          "max-md:absolute max-md:bottom-0 max-md:rounded-t-3xl max-md:rounded-b-none"
        )}
      >
        <div
          className={cn(
            "glass border border-white/10 backdrop-blur-2xl",
            "md:rounded-3xl md:p-8",
            "max-md:rounded-t-3xl max-md:p-6 max-md:pb-8"
          )}
        >
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#8B5CF6] flex items-center justify-center glow-lime">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-white">Flux</h1>
            </div>
          </div>

          {/* Social Auth Section */}
          <div className="mb-6">
            <SocialLogin onClick={handleGoogleLogin} />
          </div>

          {/* Divider */}
          <div className="flex mb-6">
            <div className="flex items-center w-full">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className=" flex justify-center text-xs min-w-fit">
              <span className="px-4 text-white/50">Ou continue com E-mail</span>
            </div>
            <div className="flex items-center w-full">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>

          {/* Feature Form */}
          <AuthForm />
        </div>
      </motion.div>
    </div>
  );
}
