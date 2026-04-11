import { AdminLayout } from "@/components/admin-layout";
import { useListOrders, useUpdateOrderStatus, OrderStatus as OrderStatusEnum, Order } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, AlertTriangle, FlaskConical, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useSSEOrders(onNewOrder: () => void) {
  useEffect(() => {
    let es: EventSource | null = null;
    function connect() {
      es = new EventSource(`${BASE}/api/orders/events`);
      es.addEventListener("new_order", () => onNewOrder());
      es.addEventListener("order_updated", () => onNewOrder());
      es.addEventListener("order_deleted", () => onNewOrder());
      es.onerror = () => { es?.close(); setTimeout(connect, 5000); };
    }
    connect();
    return () => es?.close();
  }, [onNewOrder]);
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const updateStatus = useUpdateOrderStatus();
  const updateStatusRef = useRef(updateStatus.mutate);
  updateStatusRef.current = updateStatus.mutate;
  const { token } = useAuth();

  const [cancelDialogOrder, setCancelDialogOrder] = useState<Order | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [newOrderBanner, setNewOrderBanner] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  useSSEOrders(() => {
    refresh();
    setNewOrderBanner(true);
    setTimeout(() => setNewOrderBanner(false), 4000);
  });

  const { data: orders, isLoading } = useListOrders(
    { status: statusFilter !== "all" ? statusFilter as any : undefined },
    { query: { queryKey: ["orders", statusFilter] } }
  );

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

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusRef.current({ id: orderId, data: { status: newStatus as any } }, {
      onSuccess: () => {
        toast.success(`Order #${orderId} → ${newStatus}`);
        refresh();
      },
      onError: () => toast.error("Failed to update status"),
    });
  };

  const handleDeleteTest = async (order: Order) => {
    if (!confirm(`Delete test order #${order.id}? This cannot be undone.`)) return;
    const res = await fetch(`${BASE}/api/orders/${order.id}`, {
      method: "DELETE",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (res.ok) {
      toast.success(`Test order #${order.id} deleted`);
      refresh();
    } else {
      const d = await res.json();
      toast.error(d.error || "Failed to delete");
    }
  };

  const handleCancelPaidOrder = async () => {
    if (!cancelDialogOrder) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`${BASE}/api/orders/${cancelDialogOrder.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ adminPassword, reason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Cancellation failed");
      } else {
        toast.success(`Order #${cancelDialogOrder.id} cancelled. Issue refund in Stripe.`);
        setCancelDialogOrder(null);
        setAdminPassword("");
        setCancelReason("");
        refresh();
      }
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AdminLayout>
      {newOrderBanner && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-400 text-black font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Bell className="w-5 h-5" /> New order received!
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground mt-1">Manage and update customer orders in real time.</p>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {Object.values(OrderStatusEnum).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-xl">
            <h3 className="font-serif text-xl font-medium mb-2">No Orders Found</h3>
            <p className="text-muted-foreground">There are no orders matching your current filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order: Order) => {
              const isTest = (order as any).isTest === true || order.customerName?.startsWith("[TEST]");
              const isPaid = order.stripeStatus === "paid" || (order.stripePaymentIntentId && !isTest);
              return (
                <Card key={order.id} className={`overflow-hidden ${isTest ? "border-dashed border-gray-300 opacity-90" : ""}`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="font-bold font-serif text-xl">#{order.id}</span>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                          {isTest && (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-300 flex items-center gap-1 hover:bg-gray-100">
                              <FlaskConical className="w-3 h-3" /> TEST
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground ml-auto">
                            {format(new Date(order.createdAt), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.customerPhone || order.customerEmail}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</div>
                            <div className="font-medium">${order.total.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              {isTest ? "Test — no charge" : isPaid ? "Paid · Stripe" : "Payment pending"}
                            </div>
                          </div>
                        </div>
                        {order.estimatedReadyAt && (
                          <div className="text-xs text-muted-foreground mb-3">
                            Ready by: <span className="font-medium text-foreground">
                              {new Date(order.estimatedReadyAt).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", hour12: true })}
                            </span>
                          </div>
                        )}
                        {order.specialInstructions && (
                          <div className="bg-muted/50 p-3 rounded-md text-sm border border-border/50">
                            <span className="font-semibold text-xs uppercase tracking-wider block mb-1">Notes</span>
                            {order.specialInstructions}
                          </div>
                        )}
                      </div>

                      <div className="w-full lg:w-[400px] flex flex-col bg-muted/20">
                        <div className="flex-1 p-6">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Items</div>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                  <span className="font-medium mr-2">{item.quantity}×</span>
                                  {item.menuItemName}
                                  {item.specialInstructions && (
                                    <div className="text-xs text-muted-foreground ml-6 italic">— {item.specialInstructions}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 border-t border-border bg-card space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium whitespace-nowrap">Status:</span>
                            <Select value={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(OrderStatusEnum).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Delete / Cancel */}
                          {isTest ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                              onClick={() => handleDeleteTest(order)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Test Order
                            </Button>
                          ) : order.status !== "cancelled" && order.status !== "completed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 flex items-center gap-2"
                              onClick={() => setCancelDialogOrder(order)}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" /> Cancel Order (Admin Auth Required)
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Cancel Dialog */}
      <Dialog open={!!cancelDialogOrder} onOpenChange={(o) => !o && setCancelDialogOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Cancel Order #{cancelDialogOrder?.id}
            </DialogTitle>
            <DialogDescription>
              This order may have been paid. Cancellation is permanent and will require you to issue a refund manually in Stripe. Admin password is required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium block mb-1.5">Cancellation Reason</label>
              <Input
                placeholder="e.g. Customer called to cancel, requested refund"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Admin Password</label>
              <Input
                type="password"
                placeholder="Enter admin cancellation password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: matches your SESSION_SECRET. Set ADMIN_CANCEL_PASSWORD env var to override.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setCancelDialogOrder(null)}>
                Keep Order
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleCancelPaidOrder}
                disabled={isCancelling || !adminPassword || !cancelReason}
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
