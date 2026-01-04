 ;

import { useState, useEffect } from "react";
import { Bell, Lock, Volume2, Moon, Smartphone, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserService } from "@/services/user-service";
import { useAuth } from "@/features/auth/auth";

interface PreferenceItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const PREFERENCES_CONFIG: PreferenceItem[] = [
  {
    id: "notifications",
    label: "Notificações",
    description: "Receber alertas sobre contas e hábitos",
    icon: Bell,
  },
  // Descomente e traduza conforme for implementando as funcionalidades reais
  /*
  {
    id: "biometric",
    label: "Bloqueio Biométrico",
    description: "Usar Face ID ou digital para entrar",
    icon: Lock,
  },
  {
    id: "sound",
    label: "Efeitos Sonoros",
    description: "Sons ao concluir tarefas",
    icon: Volume2,
  },
  {
    id: "darkMode",
    label: "Modo Escuro OLED",
    description: "Otimizado para economia de bateria",
    icon: Moon,
  },
  */
];

export function AppPreferences() {
  const { user } = useAuth();
  const [prefsState, setPrefsState] = useState<Record<string, boolean>>({
    notifications: true,
    // biometric: false,
    // sound: true,
    // darkMode: true,
  });

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      try {
        const data = await UserService.getUserData(user.id);
        if (data?.preferences) {
          setPrefsState((prev) => ({ ...prev, ...data.preferences }));
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const togglePreference = async (id: string) => {
    const newValue = !prefsState[id];

    setPrefsState((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    try {
      await UserService.updatePreferences({ [id]: newValue });
    } catch (error) {
      console.error("Erro ao salvar preferência:", error);
      setPrefsState((prev) => ({ ...prev, [id]: !newValue }));
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6">Preferências do App</h3>

      <div className="space-y-4">
        {PREFERENCES_CONFIG.map((pref) => {
          const Icon = pref.icon;
          const isEnabled = prefsState[pref.id] ?? false;

          return (
            <div
              key={pref.id}
              className="flex items-start gap-4 p-4 rounded-xl glass-hover border border-white/10 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isEnabled ? "bg-[#CCFF00]/20" : "bg-white/5"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isEnabled ? "text-[#CCFF00]" : "text-white/40"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={pref.id}
                  className="text-base font-semibold text-white cursor-pointer"
                >
                  {pref.label}
                </Label>
                <p className="text-sm text-white/50 mt-1">{pref.description}</p>
              </div>

              <Switch
                id={pref.id}
                checked={isEnabled}
                onCheckedChange={() => togglePreference(pref.id)}
                className="data-[state=checked]:bg-[#CCFF00] data-[state=checked]:glow-lime"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
