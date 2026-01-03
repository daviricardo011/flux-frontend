"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserService } from "@/services/user-service";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/features/auth/auth";

export function ProfileSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const joinDate = auth.currentUser?.metadata.creationTime
    ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString(
        "pt-BR"
      )
    : "Data desconhecida";

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "US";

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      await UserService.updateProfile(name);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) setName(user.name);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <Avatar className="w-24 h-24 border-2 border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)]">
            <AvatarImage src={user?.avatar} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-[#CCFF00] to-[#8B5CF6] text-black text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">
              {name || "Usuário"}
            </h2>
            <p className="text-white/60 mb-4 capitalize">
              Membro desde {joinDate}
            </p>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10 hover:text-[#CCFF00] transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto md:mx-0">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-white/70 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#CCFF00]" />
              Nome Completo
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="bg-white/5 border-white/20 text-white disabled:opacity-60 focus:border-[#CCFF00] transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-white/70 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#CCFF00]" />
              Endereço de E-mail
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-white/5 border-white/20 text-white/50 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#CCFF00]" />
              Data de Cadastro
            </Label>
            <Input
              value={joinDate}
              disabled
              className="bg-white/5 border-white/20 text-white/40 cursor-not-allowed capitalize"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10 animate-in slide-in-from-top-2">
            <Button
              onClick={handleCancel}
              variant="ghost"
              disabled={isLoading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-[#CCFF00] hover:bg-[#CCFF00]/80 text-black font-bold glow-lime transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-white/10 text-center hover:border-[#CCFF00]/30 transition-colors">
          <p className="text-2xl font-bold text-[#CCFF00]">0</p>
          <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
            Hábitos
          </p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10 text-center hover:border-[#8B5CF6]/30 transition-colors">
          <p className="text-2xl font-bold text-[#8B5CF6]">0</p>
          <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
            Sequência
          </p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10 text-center hover:border-white/30 transition-colors">
          <p className="text-2xl font-bold text-white">R$ 0,00</p>
          <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
            Economia
          </p>
        </div>
      </div>
    </div>
  );
}
