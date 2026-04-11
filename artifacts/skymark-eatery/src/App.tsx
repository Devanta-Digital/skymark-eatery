import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Checkout from "@/pages/checkout";
import OrderStatus from "@/pages/order";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import AdminLogin from "@/pages/admin-login";
import Kitchen from "@/pages/kitchen";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminMenu from "@/pages/admin/menu";
import AdminSpecials from "@/pages/admin/specials";
import AdminFinance from "@/pages/admin/finance";
import AdminSubscriptions from "@/pages/admin/subscriptions";
import AdminAI from "@/pages/admin/ai";
import AdminSettings from "@/pages/admin/settings";
import Catering from "@/pages/catering";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const queryClient = new QueryClient();

const STAFF_ROLES = ["admin", "developer", "staff"];
const ADMIN_ROLES = ["admin", "developer"];

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !ADMIN_ROLES.includes(user.role))) {
      navigate("/admin-login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Verifying access...</div>
      </div>
    );
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Verifying access...</div>
      </div>
    );
  }

  if (!user || !STAFF_ROLES.includes(user.role)) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order/:id" component={OrderStatus} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/kitchen">
        {() => <RequireStaff><Kitchen /></RequireStaff>}
      </Route>
      <Route path="/admin">
        {() => <RequireAdmin><AdminDashboard /></RequireAdmin>}
      </Route>
      <Route path="/admin/orders">
        {() => <RequireAdmin><AdminOrders /></RequireAdmin>}
      </Route>
      <Route path="/admin/menu">
        {() => <RequireAdmin><AdminMenu /></RequireAdmin>}
      </Route>
      <Route path="/admin/specials">
        {() => <RequireAdmin><AdminSpecials /></RequireAdmin>}
      </Route>
      <Route path="/admin/finance">
        {() => <RequireAdmin><AdminFinance /></RequireAdmin>}
      </Route>
      <Route path="/admin/subscriptions">
        {() => <RequireAdmin><AdminSubscriptions /></RequireAdmin>}
      </Route>
      <Route path="/admin/ai">
        {() => <RequireAdmin><AdminAI /></RequireAdmin>}
      </Route>
      <Route path="/admin/settings">
        {() => <RequireAdmin><AdminSettings /></RequireAdmin>}
      </Route>
      <Route path="/catering" component={Catering} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
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
