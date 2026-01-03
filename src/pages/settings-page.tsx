import { ProfileSettings } from "@/features/settings/components/profile-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppPreferences } from "@/features/settings/components/app-preferences";
import { CategoryManager } from "@/features/settings/components/category-manager";

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-white/60">
          Gerencie seu perfil, preferências e categorias financeiras
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass w-full md:w-auto rounded-xl p-1 border border-white/10 mb-6">
          <TabsTrigger
            value="profile"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black data-[state=active]:glow-lime transition-all"
          >
            Perfil
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black data-[state=active]:glow-lime transition-all"
          >
            Categorias
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black data-[state=active]:glow-lime transition-all"
          >
            Preferências
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="mt-0 focus-visible:outline-none"
        >
          <ProfileSettings />
        </TabsContent>

        <TabsContent
          value="categories"
          className="mt-0 focus-visible:outline-none"
        >
          <CategoryManager />
        </TabsContent>

        <TabsContent
          value="preferences"
          className="mt-0 focus-visible:outline-none"
        >
          <AppPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
