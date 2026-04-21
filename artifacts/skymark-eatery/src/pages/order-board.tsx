import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ChefHat, Utensils } from "lucide-react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Order {
  id: number;
  customerName: string;
  status: string;
  estimatedReadyAt?: string;
}

const STATUS_CONFIG = {
  pending: { label: "Received", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  confirmed: { label: "In Kitchen", icon: ChefHat, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  preparing: { label: "Cooking", icon: ChefHat, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  ready: { label: "READY ✓", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
};

export default function OrderBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      const all: Order[] = await res.json();
      const active = all.filter((o) => ["pending", "confirmed", "preparing", "ready"].includes(o.status));
      setOrders(active.slice(0, 20));
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  const ready = orders.filter((o) => o.status === "ready");
  const inProgress = orders.filter((o) => ["pending", "confirmed", "preparing"].includes(o.status));

  return (
    <div className="min-h-screen bg-gray-950 text-white select-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-primary px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg px-3 py-1.5">
            <img src="/logo-transparent.webp" alt="Skymark Eatery" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order Status Board</h1>
            <p className="text-primary-foreground/70 text-sm">Real-time order updates</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-bold tabular-nums">
            {clock.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="text-primary-foreground/60 text-sm">
            {clock.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </header>

      {/* Italian flag stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-green-500"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-red-500"></div>
      </div>

      <div className="grid grid-cols-5 gap-0 h-[calc(100vh-90px)]">
        {/* In Progress Column */}
        <div className="col-span-3 border-r border-gray-800 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-bold text-gray-200 uppercase tracking-widest flex items-center gap-3">
              <ChefHat className="w-5 h-5 text-orange-400" />
              Being Prepared
            </h2>
          </div>
          <div className="flex-1 p-6 grid grid-cols-3 gap-4 content-start overflow-hidden">
            {inProgress.length === 0 ? (
              <div className="col-span-3 text-center text-gray-600 py-16">
                <Utensils className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No active orders</p>
              </div>
            ) : (
              inProgress.map((order) => {
                const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const Icon = config.icon;
                return (
                  <div key={order.id} className={`border rounded-2xl p-4 ${config.bg} flex flex-col items-center text-center gap-2`}>
                    <div className="font-mono font-black text-5xl text-white">#{order.id}</div>
                    <div className="text-gray-400 text-sm truncate w-full">{order.customerName}</div>
                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${config.color}`}>
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="col-span-2 flex flex-col bg-emerald-950/30">
          <div className="px-6 py-4 border-b border-emerald-800/40 bg-emerald-900/20">
            <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              Ready for Pickup!
            </h2>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-hidden">
            {ready.length === 0 ? (
              <div className="text-center text-gray-600 py-16">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">None ready yet</p>
              </div>
            ) : (
              ready.map((order) => (
                <div key={order.id} className="border border-emerald-500/40 bg-emerald-500/10 rounded-2xl p-5 flex items-center gap-4 animate-pulse-subtle">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-mono font-black text-5xl text-emerald-300">#{order.id}</div>
                    <div className="text-emerald-400/80 font-semibold">{order.customerName}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-600">
            Please collect your order at the counter · Skymark Eatery
          </div>
        </div>
      </div>
    </div>
  );
}
