import { Layout } from "@/components/layout";
import { useGetOrder, useGetOrderTiming } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, ChefHat, PackageCheck, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function OrderStatus() {
  const params = useParams();
  const id = parseInt(params.id || "0");

  const { data: order, isLoading: isOrderLoading } = useGetOrder(id, {
    query: { enabled: !!id, queryKey: ["order", id] },
  });

  const { data: timing, isLoading: isTimingLoading } = useGetOrderTiming({
    query: { queryKey: ["order-timing"] },
  });

  if (isOrderLoading || isTimingLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Skeleton className="h-12 w-64 mx-auto mb-8" />
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return <Clock className="w-12 h-12 text-primary" />;
      case "preparing":
        return <ChefHat className="w-12 h-12 text-accent" />;
      case "ready":
        return <PackageCheck className="w-12 h-12 text-green-600" />;
      case "completed":
        return <CheckCircle2 className="w-12 h-12 text-green-600" />;
      default:
        return <Clock className="w-12 h-12 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Waiting for Confirmation";
      case "confirmed": return "Order Confirmed";
      case "preparing": return "In the Kitchen";
      case "ready": return "Ready for Pickup";
      case "completed": return "Order Complete";
      case "cancelled": return "Order Cancelled";
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="bg-muted py-8 border-b border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-primary">Order #{order.id}</h1>
          <p className="text-muted-foreground mt-2">Placed on {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Status Card */}
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/5 rounded-full">
              {getStatusIcon(order.status)}
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">{getStatusText(order.status)}</h2>
          
          {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
            <div className="mt-6 p-4 bg-muted rounded-lg inline-block text-left">
              <div className="text-sm text-muted-foreground mb-1">Estimated Ready Time</div>
              <div className="font-serif font-bold text-xl text-primary">
                {order.estimatedReadyAt 
                  ? format(new Date(order.estimatedReadyAt), "h:mm a")
                  : timing?.estimatedReadyAt 
                    ? format(new Date(timing.estimatedReadyAt), "h:mm a")
                    : "Calculating..."}
              </div>
              {timing?.isPeakHours && (
                <div className="text-xs text-accent mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Kitchen is currently busy
                </div>
              )}
            </div>
          )}
          
          {order.status === 'ready' && (
            <p className="text-lg text-green-700 mt-4">
              Your order is ready! Please head to the counter for pickup.
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 bg-muted/50 border-b border-border">
            <h3 className="font-serif text-xl font-semibold">Order Summary</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-medium mr-2">{item.quantity}x</span>
                    <span>{item.menuItemName}</span>
                    {item.specialInstructions && (
                      <p className="text-sm text-muted-foreground mt-1 ml-6">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="font-medium whitespace-nowrap">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${(order.total / 1.13).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (13%)</span>
                <span>${(order.total - (order.total / 1.13)).toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-serif text-xl font-bold">Total Paid</span>
              <span className="font-serif text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="p-6 bg-muted/30 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Customer Details</h4>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
              {order.customerPhone && <p className="text-sm text-muted-foreground">{order.customerPhone}</p>}
            </div>
            {order.specialInstructions && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Order Notes</h4>
                <p className="text-sm italic text-muted-foreground">"{order.specialInstructions}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
