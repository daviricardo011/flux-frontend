import {
  Home,
  TrendingUp,
  Target,
  Settings,
  List,
  Brain,
  Heart,
} from "lucide-react";

export const routesPaths = {
  dashboard: "/",
  finance: "/finance",
  intelligence: "/intelligence",
  habits: "/habits",
  health: "/health",
  lists: "/lists",
  settings: "/settings",
  signin: "/login",
} as const;

export const menuItems = [
  { icon: Home, label: "Dashboard", to: routesPaths.dashboard },
  { icon: TrendingUp, label: "Finanças", to: routesPaths.finance },
  { icon: Brain, label: "Inteligência", to: routesPaths.intelligence },
  { icon: Target, label: "Hábitos", to: routesPaths.habits },
  { icon: Heart, label: "Saúde", to: routesPaths.health },
  { icon: List, label: "Listas", to: routesPaths.lists },
  { icon: Settings, label: "Configurações", to: routesPaths.settings },
];
