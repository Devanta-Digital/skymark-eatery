import { Layout } from "@/components/layout";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder, useCreatePaymentIntent, useConfirmPayment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, CheckCircle2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number is required"),
  specialInstructions: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

function PaymentForm({ orderId, clientSecret, onSuccess, amount }: { orderId: number, clientSecret: string, onSuccess: (orderId: number) => void, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const confirmPayment = useConfirmPayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await confirmPayment.mutateAsync({ data: { orderId, paymentIntentId: paymentIntent.id } });
        onSuccess(orderId);
      } catch {
        toast.error("Payment succeeded but order confirmation failed. Please contact us.");
        setIsProcessing(false);
      }
    } else {
      toast.error("Unexpected payment status.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card p-4 rounded-md border border-border">
        <PaymentElement />
      </div>
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full h-12 text-lg">
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

function DemoPaymentForm({ orderId, onSuccess, amount }: { orderId: number, onSuccess: (orderId: number) => void, amount: number }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDemoConfirm = async () => {
    setIsProcessing(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      await fetch(`${base}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });
      toast.success("Demo order confirmed! Sending to kitchen...");
      onSuccess(orderId);
    } catch {
      toast.error("Failed to confirm demo order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-blue-800 font-medium">
          <FlaskConical className="w-4 h-4" />
          Simulated Payment — Demo Mode
        </div>
        <p className="text-sm text-blue-700">
          In production, a real Stripe payment form would appear here. Click below to simulate a successful payment and see the full order confirmation flow.
        </p>
        <div className="bg-white border border-blue-100 rounded-md p-3 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Card Number</span>
            <span className="font-mono text-blue-600">4242 4242 4242 4242</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Expiry / CVC</span>
            <span className="font-mono text-blue-600">12/29 · 123</span>
          </div>
        </div>
      </div>
      <Button
        onClick={handleDemoConfirm}
        disabled={isProcessing}
        className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
      >
        <CheckCircle2 className="w-5 h-5 mr-2" />
        {isProcessing ? "Confirming..." : `Simulate Payment · $${amount.toFixed(2)}`}
      </Button>
    </div>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const isDemoMode = new URLSearchParams(search).get("demo") === "1";
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const createOrder = useCreateOrder();
  const createPaymentIntent = useCreatePaymentIntent();

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: isDemoMode ? "Demo Customer" : "",
      customerEmail: isDemoMode ? "demo@skymarkeatery.dev" : "",
      customerPhone: isDemoMode ? "(416) 555-0100" : "",
      specialInstructions: "",
    },
  });

  useEffect(() => {
    if (items.length === 0 && !createdOrderId) {
      setLocation("/menu");
    }
  }, [items, createdOrderId, setLocation]);

  const onSubmit = async (data: CheckoutValues) => {
    if (items.length === 0) return;
    try {
      const order = await createOrder.mutateAsync({
        data: {
          ...data,
          items: items.map(item => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions || undefined,
          })),
        },
      });
      setCreatedOrderId(order.id);

      if (!isDemoMode) {
        const paymentIntent = await createPaymentIntent.mutateAsync({ data: { orderId: order.id } });
        setClientSecret(paymentIntent.clientSecret);
      } else {
        setClientSecret("demo");
      }
    } catch {
      toast.error("Failed to create order. Please try again.");
    }
  };

  const handlePaymentSuccess = (orderId: number) => {
    clearCart();
    toast.success("Order placed successfully!");
    setLocation(`/order/${orderId}`);
  };

  if (items.length === 0 && !createdOrderId) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-muted py-8 border-b border-border/40">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Checkout</h1>
          {isDemoMode && (
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-100 flex items-center gap-1.5 px-3 py-1 text-sm">
              <FlaskConical className="w-3.5 h-3.5" />
              Demo Preview Mode
            </Badge>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Area */}
          <div className="flex-1 max-w-2xl">
            {!clientSecret ? (
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                {isDemoMode && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-blue-700">
                    <FlaskConical className="w-4 h-4 shrink-0" />
                    Demo mode: form is pre-filled. Click "Continue to Payment" to see the payment simulation.
                  </div>
                )}
                <h2 className="font-serif text-2xl font-semibold mb-6">Your Details</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any allergies or special requests for the kitchen?"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg mt-4"
                      disabled={createOrder.isPending || createPaymentIntent.isPending}
                    >
                      {createOrder.isPending || createPaymentIntent.isPending ? "Processing..." : "Continue to Payment"}
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold mb-6">Payment</h2>
                {isDemoMode || clientSecret === "demo" ? (
                  <DemoPaymentForm
                    orderId={createdOrderId!}
                    onSuccess={handlePaymentSuccess}
                    amount={total * 1.13}
                  />
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                    <PaymentForm
                      orderId={createdOrderId!}
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      amount={total * 1.13}
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-muted border border-border/60 rounded-xl p-6 sticky top-24">
              <h3 className="font-serif text-xl font-semibold mb-6 pb-4 border-b border-border/50 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="font-medium">
                        <span className="text-muted-foreground mr-2">{item.quantity}×</span>
                        {item.menuItem.name}
                      </div>
                      {item.specialInstructions && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="font-medium whitespace-nowrap">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HST (13%)</span>
                  <span>${(total * 0.13).toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-xl font-serif font-bold">
                <span>Total</span>
                <span>${(total * 1.13).toFixed(2)}</span>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                Pickup only · Ready in {new Date().getHours() >= 11 && new Date().getHours() < 13 ? "~25" : "~15"} minutes
              </div>

              {isDemoMode && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Link href="/admin" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    ← Back to Admin Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
