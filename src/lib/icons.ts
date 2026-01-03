import {
  ShoppingBag,
  Coffee,
  Zap,
  Home,
  Wifi,
  Car,
  TrendingUp,
  Briefcase,
  Gift,
  Heart,
  Phone,
  Tv,
  DollarSign,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ShoppingBag: ShoppingBag,
  Coffee: Coffee,
  Zap: Zap,
  Home: Home,
  Wifi: Wifi,
  Car: Car,
  TrendingUp: TrendingUp,
  Briefcase: Briefcase,
  Gift: Gift,
  Heart: Heart,
  Phone: Phone,
  Tv: Tv,
  DollarSign: DollarSign,
  PiggyBank: PiggyBank,
};

export const iconOptions = Object.keys(iconMap);

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || DollarSign;
};
