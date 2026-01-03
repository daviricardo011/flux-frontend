import { Sidebar } from "../sidebar";
import { MobileNav } from "../mobile-nav";
import { Outlet } from "@tanstack/react-router";

export function AppShell() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-xl h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-0 pb-20 md:pb-0 scrollbar-hide">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <MobileNav />
      </div>
    </div>
  );
}
