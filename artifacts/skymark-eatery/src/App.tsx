import { Suspense, lazy, useEffect, useLayoutEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const Menu = lazy(() => import("@/pages/menu"));
const Checkout = lazy(() => import("@/pages/checkout"));
const OrderStatus = lazy(() => import("@/pages/order"));
const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const Kitchen = lazy(() => import("@/pages/kitchen"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));
const AdminMenu = lazy(() => import("@/pages/admin/menu"));
const AdminSpecials = lazy(() => import("@/pages/admin/specials"));
const AdminFinance = lazy(() => import("@/pages/admin/finance"));
const AdminSubscriptions = lazy(() => import("@/pages/admin/subscriptions"));
const AdminAI = lazy(() => import("@/pages/admin/ai"));
const AdminSettings = lazy(() => import("@/pages/admin/settings"));
const Catering = lazy(() => import("@/pages/catering"));
const Contact = lazy(() => import("@/pages/contact"));
const OrderBoard = lazy(() => import("@/pages/order-board"));

const queryClient = new QueryClient();

const STAFF_ROLES = ["admin", "developer", "staff"];
const ADMIN_ROLES = ["admin", "developer"];

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !ADMIN_ROLES.includes(user.role))) {
      navigate("/admin-login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <RouteFallback />;
  }

  if (!user || !ADMIN_ROLES.includes(user.role)) return null;
  return <>{children}</>;
}

function RequireStaff({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !STAFF_ROLES.includes(user.role))) {
      navigate("/admin-login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <RouteFallback />;
  }

  if (!user || !STAFF_ROLES.includes(user.role)) return null;
  return <>{children}</>;
}

/** Reset scroll on pathname change; respect hash targets (e.g. /catering#inquire). */
function ScrollRestoration() {
  const [location] = useLocation();
  const prevPath = useRef<string | null>(null);

  useLayoutEffect(() => {
    const path = String(location).split("?")[0].split("#")[0];
    const hash =
      typeof window !== "undefined"
        ? window.location.hash.replace(/^#/, "")
        : "";

    if (prevPath.current === null) {
      prevPath.current = path;
      if (hash) {
        requestAnimationFrame(() => {
          const el = document.getElementById(decodeURIComponent(hash));
          if (el) {
            el.scrollIntoView({ block: "start", behavior: "auto" });
          }
        });
      }
      return;
    }

    if (prevPath.current !== path) {
      prevPath.current = path;
      if (hash) {
        requestAnimationFrame(() => {
          const el = document.getElementById(decodeURIComponent(hash));
          if (el) {
            el.scrollIntoView({ block: "start", behavior: "auto" });
          }
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order/:id" component={OrderStatus} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/kitchen">
          {() => (
            <RequireStaff>
              <Kitchen />
            </RequireStaff>
          )}
        </Route>
        <Route path="/order-board">
          {() => (
            <RequireStaff>
              <OrderBoard />
            </RequireStaff>
          )}
        </Route>
        <Route path="/admin">
          {() => (
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/orders">
          {() => (
            <RequireAdmin>
              <AdminOrders />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/menu">
          {() => (
            <RequireAdmin>
              <AdminMenu />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/specials">
          {() => (
            <RequireAdmin>
              <AdminSpecials />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/finance">
          {() => (
            <RequireAdmin>
              <AdminFinance />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/subscriptions">
          {() => (
            <RequireAdmin>
              <AdminSubscriptions />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/ai">
          {() => (
            <RequireAdmin>
              <AdminAI />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/settings">
          {() => (
            <RequireAdmin>
              <AdminSettings />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/catering" component={Catering} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <ScrollRestoration />
              <Router />
            </WouterRouter>
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
