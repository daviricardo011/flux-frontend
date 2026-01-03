import {
  createRouter,
  createRoute,
  createRootRouteWithContext,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import type { AuthContextType } from "../features/auth/types";
import { AuthPage } from "@/pages/auth-page";
import { DashboardGrid } from "@/components/dashboard-grid";
import { FinancePage } from "@/pages/finance-page";
import { GrowthPage } from "@/pages/growth-page";
import { HealthPage } from "@/pages/health-page";
import { IntelligencePage } from "@/pages/intelligence-page";
import { AppShell } from "@/components/layout/AppShell";
import { ListsPage } from "@/pages/lists-page";
import { SettingsPage } from "@/pages/settings-page";
import { routesPaths } from "@/routes/constants";

interface RouterContext {
  auth: AuthContextType | undefined;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

// --- ROTA PÚBLICA ---
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routesPaths.signin,
  component: AuthPage,
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: routesPaths.dashboard });
    }
  },
});

// --- ROTA PROTEGIDA ---
const authenticatedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "_auth",
  component: AppShell,
  beforeLoad: ({ context }) => {
    if (!context.auth?.isAuthenticated && !context.auth?.isLoading) {
      throw redirect({ to: routesPaths.signin });
    }
  },
});

const indexRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.dashboard,
  component: DashboardGrid,
});

const financeRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.finance,
  component: FinancePage,
});

const habitsRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.habits,
  component: GrowthPage,
});

const healthRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.health,
  component: HealthPage,
});

const listsRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.lists,
  component: ListsPage,
});

const intelligenceRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.intelligence,
  component: IntelligencePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: routesPaths.settings,
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedLayout.addChildren([
    indexRoute,
    financeRoute,
    habitsRoute,
    healthRoute,
    listsRoute,
    intelligenceRoute,
    settingsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
