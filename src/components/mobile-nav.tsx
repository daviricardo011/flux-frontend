import { cn } from "@/lib/utils";
import { menuItems } from "@/routes/constants";
import { Link, useLocation } from "@tanstack/react-router";

export function MobileNav() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="glass rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl max-w-md mx-auto overflow-hidden">
        <div className="flex items-center justify-start overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.to;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 flex-shrink-0 min-w-[72px]",
                  isActive
                    ? "text-[#CCFF00] scale-105 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
