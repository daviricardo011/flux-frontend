import { useState } from "react";
import { User, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { menuItems, routesPaths } from "@/routes/constants";

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-white/10 transition-all duration-300 h-full bg-black/40 backdrop-blur-xl",
        expanded ? "w-60" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 shrink-0">
        <div
          className={cn(
            "font-bold text-[#CCFF00] transition-all tracking-widest",
            expanded ? "text-xl" : "text-lg"
          )}
        >
          {expanded ? "FLUX" : "F"}
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative",
                isActive
                  ? "bg-white/10 text-[#CCFF00]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive && "drop-shadow-[0_0_5px_rgba(204,255,0,0.5)]"
                )}
              />

              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap transition-all duration-300 origin-left",
                  expanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                )}
              >
                {item.label}
              </span>

              {!expanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setExpanded(!expanded)}
        className="h-12 flex items-center justify-center border-t border-white/10 hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
      >
        {expanded ? (
          <ChevronLeft className="w-5 h-5 text-white/70" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white/70" />
        )}
      </button>

      {/* Dados usuário */}
      <div className="h-16 flex items-center justify-center border-t border-white/10 shrink-0">
        <Link
          to={routesPaths.settings}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer",
            expanded ? "w-full mx-2" : "w-auto"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 ring-2 ring-black">
            <User className="w-4 h-4 text-black" />
          </div>

          <div
            className={cn(
              "text-left transition-all duration-300 overflow-hidden",
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            <div className="text-sm font-medium text-white truncate">Você</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">
              Nome
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
