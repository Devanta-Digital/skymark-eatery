import { AdminLayout } from "@/components/admin-layout";
import { useGetAdminDashboard, useGetRecentOrders, useListMenuItems, Order } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, Clock, ChefHat, TrendingUp, AlertCircle, FlaskConical, Send, ChevronRight, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const { addItem, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isStartingPreview, setIsStartingPreview] = useState(false);
  const [lastTestOrder, setLastTestOrder] = useState<{ id: number; customerName: string; total: number } | null>(null);

  const isDeveloper = user?.role === "developer";

  const { data: menuItems } = useListMenuItems(
    { available: true },
    { query: { queryKey: ["menu-items-for-test", { available: true }], enabled: isDeveloper } }
  );

  const sendTestOrder = async () => {
    if (!token) return;
    setIsSendingTest(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/orders/test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send test order");
      }
      const order = await res.json();
      setLastTestOrder({ id: order.id, customerName: order.customerName, total: order.total });
      toast.success(`Test order #${order.id} created and sent to kitchen!`);
      queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to send test order");
    } finally {
      setIsSendingTest(false);
    }
  };

  const previewOrderFlow = () => {
    if (!menuItems || menuItems.length === 0) {
      toast.error("No menu items available to preview with");
      return;
    }
    setIsStartingPreview(true);
    clearCart();
    const picks = menuItems.filter((i) => i.categoryId != null && i.categoryId <= 5).slice(0, 3);
    if (picks.length === 0) {
      const fallback = menuItems.slice(0, 3);
      fallback.forEach(item => addItem(item, 1));
    } else {
      picks.forEach(item => addItem(item, 1));
    }
    toast.success("Cart pre-filled — taking you to checkout preview");
    setTimeout(() => {
      setIsStartingPreview(false);
      setLocation("/checkout?demo=1");
    }, 600);
  };

  const { data: stats, isLoading: isStatsLoading } = useGetAdminDashboard({
    query: { queryKey: ["admin-dashboard"] },
  });

  const { data: recentOrders, isLoading: isOrdersLoading } = useGetRecentOrders({
    query: {
      queryKey: ["recent-orders"],
      refetchInterval: 10000,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing": return "bg-orange-100 text-orange-800 border-orange-200";
      case "ready": return "bg-green-100 text-green-800 border-green-200";
      case "completed": return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time overview of today's operations.</p>
          </div>

          {stats?.isPeakHours && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3 py-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Peak Hours Active ({stats.currentTimingWindow}m wait)
            </Badge>
          )}
        </div>

        {/* Developer Test Order Panel */}
        {isDeveloper && (
          <Card className="bg-blue-50/50 border-blue-200 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-blue-800">Developer Test Tools</div>
                  <div className="text-xs text-blue-600">Two ways to test the ordering system</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Option 1: Silent test order */}
                <div className="bg-white rounded-lg border border-blue-100 p-3 space-y-2">
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Option 1 — Kitchen test</div>
                  <p className="text-xs text-blue-600">Creates a randomized order directly in the system and sends it to the Kitchen Display — no checkout UI, no payment.</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {lastTestOrder && (
                      <Link href={`/order/${lastTestOrder.id}`}>
                        <span className="text-xs text-blue-700 font-medium flex items-center gap-1 hover:underline cursor-pointer">
                          Last: #{lastTestOrder.id} — {lastTestOrder.customerName.replace("[TEST] ", "")} (${lastTestOrder.total.toFixed(2)}) <ChevronRight className="w-3 h-3" />
                        </span>
                      </Link>
                    )}
                    <Button size="sm" onClick={sendTestOrder} disabled={isSendingTest} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3">
                      <Send className="w-3 h-3 mr-1" />
                      {isSendingTest ? "Sending..." : "Send to Kitchen"}
                    </Button>
                  </div>
                </div>

                {/* Option 2: Full checkout preview */}
                <div className="bg-white rounded-lg border border-blue-100 p-3 space-y-2">
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Option 2 — Full order flow</div>
                  <p className="text-xs text-blue-600">Pre-fills your cart with sample items and takes you through the real checkout UI with a simulated payment step.</p>
                  <Button size="sm" onClick={previewOrderFlow} disabled={isStartingPreview} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3">
                    <Eye className="w-3 h-3 mr-1" />
                    {isStartingPreview ? "Preparing..." : "Preview Order Flow"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">${stats?.todayRevenue.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.todayOrders}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">In Kitchen</CardTitle>
              <ChefHat className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-primary">{stats?.preparingOrders}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Confirmation</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.pendingOrders}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Order Ticker */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-border pb-4 mb-4">
              <CardTitle className="font-serif flex items-center justify-between">
                <span>Live Orders</span>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : recentOrders?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No active orders at the moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders?.map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold font-serif text-lg">#{order.id}</span>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), "h:mm a")}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.items.length} items • ${order.total.toFixed(2)}
                        </div>
                      </div>
                      <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card>
            <CardHeader className="border-b border-border pb-4 mb-4">
              <CardTitle className="font-serif flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Popular Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : stats?.topItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Not enough data yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.topItems.map((item, i) => (
                    <div key={item.menuItemId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {i + 1}
                        </div>
                        <div className="text-sm font-medium">{item.name}</div>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {item.totalOrdered}x
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
