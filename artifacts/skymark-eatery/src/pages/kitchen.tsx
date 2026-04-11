import { useEffect, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, CheckCircle2, Bell, BellOff, Package, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface OrderItem {
  id: number;
  menuItemName: string;
  quantity: number;
  specialInstructions?: string;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone?: string;
  status: string;
  isTest: boolean;
  createdAt: string;
  estimatedReadyAt?: string;
  specialInstructions?: string;
  items: OrderItem[];
}

function minutesAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / 60000);
}

function timeColor(mins: number) {
  if (mins >= 20) return "bg-red-600";
  if (mins >= 12) return "bg-orange-500";
  return "bg-emerald-600";
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Toronto",
  });
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.15, 0.3].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    });
  } catch { /* audio not available */ }
}

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const prevIdsRef = useRef<Set<number>>(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/orders`, { headers });
      const allOrders: Order[] = await res.json();
      const active = allOrders.filter((o) =>
        ["pending", "confirmed", "preparing", "ready"].includes(o.status)
      );

      const withItems = await Promise.all(
        active.map(async (order) => {
          if ((order as any).items?.length > 0) return order;
          const ir = await fetch(`${API_BASE}/api/orders/${order.id}/items`);
          const items = ir.ok ? await ir.json() : [];
          return { ...order, items };
        })
      );

      setOrders((prev) => {
        const newIds = new Set(withItems.map((o) => o.id));
        const hasNew = withItems.some((o) => !prevIdsRef.current.has(o.id));
        prevIdsRef.current = newIds;
        if (hasNew && prev.length > 0) {
          if (soundRef.current) playBeep();
          setNewOrderAlert(true);
          setTimeout(() => setNewOrderAlert(false), 5000);
        }
        return withItems;
      });
      setLastUpdate(new Date());
    } catch (e) {
      console.error("Kitchen fetch error", e);
    }
  }, [token]);

  // SSE connection for real-time push
  useEffect(() => {
    let es: EventSource | null = null;
    let fallback: ReturnType<typeof setInterval> | null = null;

    function connectSSE() {
      es = new EventSource(`${API_BASE}/api/orders/events`);
      es.addEventListener("connected", () => setConnected(true));
      es.addEventListener("new_order", (e) => {
        setConnected(true);
        const order: Order = JSON.parse(e.data);
        if (["pending", "confirmed", "preparing", "ready"].includes(order.status)) {
          setOrders((prev) => {
            if (prev.find((o) => o.id === order.id)) return prev;
            if (soundRef.current) playBeep();
            setNewOrderAlert(true);
            setTimeout(() => setNewOrderAlert(false), 5000);
            return [order, ...prev];
          });
          setLastUpdate(new Date());
        }
      });
      es.addEventListener("order_updated", (e) => {
        const order: Order = JSON.parse(e.data);
        setOrders((prev) => {
          const active = ["pending", "confirmed", "preparing", "ready"].includes(order.status);
          if (!active) return prev.filter((o) => o.id !== order.id);
          const idx = prev.findIndex((o) => o.id === order.id);
          if (idx === -1) return active ? [order, ...prev] : prev;
          const next = [...prev];
          next[idx] = { ...next[idx], ...order };
          return next;
        });
        setLastUpdate(new Date());
      });
      es.addEventListener("order_deleted", (e) => {
        const { id } = JSON.parse(e.data);
        setOrders((prev) => prev.filter((o) => o.id !== id));
      });
      es.onerror = () => {
        setConnected(false);
        es?.close();
        // Fallback to polling
        fallback = setInterval(fetchOrders, 8000);
      };
    }

    fetchOrders();
    connectSSE();

    return () => {
      es?.close();
      if (fallback) clearInterval(fallback);
    };
  }, [fetchOrders]);

  const updateStatus = async (orderId: number, status: string) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const deleteTestOrder = async (orderId: number) => {
    if (!confirm("Delete this test order?")) return;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: "DELETE",
      headers,
    });
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const newOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed");
  const inKitchen = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Kitchen Display</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-yellow-400"}`}></span>
              {connected ? "Live" : "Polling"} · {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {newOrderAlert && (
            <div className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full animate-pulse font-bold text-sm">
              <Bell className="w-4 h-4" /> NEW ORDER!
            </div>
          )}
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className={`p-2 rounded-lg transition-colors ${soundEnabled ? "bg-emerald-700 text-emerald-200" : "bg-gray-700 text-gray-400"}`}
            title={soundEnabled ? "Sound On" : "Sound Off"}
          >
            {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <div className="flex gap-2">
            <Badge className="bg-yellow-500 text-black font-bold">{newOrders.length} New</Badge>
            <Badge className="bg-blue-500 text-white font-bold">{inKitchen.length} Cooking</Badge>
            <Badge className="bg-emerald-600 text-white font-bold">{readyOrders.length} Ready</Badge>
          </div>
        </div>
      </header>

      {/* 3-Column Board */}
      <div className="grid grid-cols-3 h-[calc(100vh-65px)]">
        {/* Column 1: New Orders */}
        <Column
          title="New Orders"
          color="yellow"
          count={newOrders.length}
          emptyIcon={<Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />}
          emptyText="No pending orders"
        >
          {newOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              accentColor="yellow"
              action={
                <button
                  onClick={() => updateStatus(order.id, "preparing")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
                >
                  🍳 Start Preparing
                </button>
              }
              onDelete={order.isTest ? deleteTestOrder : undefined}
            />
          ))}
        </Column>

        {/* Column 2: In Kitchen */}
        <Column
          title="In Kitchen"
          color="blue"
          count={inKitchen.length}
          emptyIcon={<ChefHat className="w-10 h-10 mx-auto mb-3 opacity-30" />}
          emptyText="Nothing cooking right now"
        >
          {inKitchen.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              accentColor="blue"
              action={
                <button
                  onClick={() => updateStatus(order.id, "ready")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Ready for Pickup
                </button>
              }
              onDelete={order.isTest ? deleteTestOrder : undefined}
            />
          ))}
        </Column>

        {/* Column 3: Ready for Pickup */}
        <Column
          title="Ready for Pickup"
          color="green"
          count={readyOrders.length}
          emptyIcon={<Package className="w-10 h-10 mx-auto mb-3 opacity-30" />}
          emptyText="No orders ready yet"
        >
          {readyOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              accentColor="green"
              action={
                <button
                  onClick={() => updateStatus(order.id, "completed")}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Package className="w-4 h-4" /> Mark Picked Up
                </button>
              }
              onDelete={order.isTest ? deleteTestOrder : undefined}
            />
          ))}
        </Column>
      </div>
    </div>
  );
}

function Column({
  title, color, count, children, emptyIcon, emptyText
}: {
  title: string;
  color: "yellow" | "blue" | "green";
  count: number;
  children: React.ReactNode;
  emptyIcon: React.ReactNode;
  emptyText: string;
}) {
  const border = color === "yellow" ? "border-yellow-500/30" : color === "blue" ? "border-blue-500/30" : "border-emerald-500/30";
  const bg = color === "yellow" ? "bg-yellow-500/10" : color === "blue" ? "bg-blue-500/10" : "bg-emerald-500/10";
  const text = color === "yellow" ? "text-yellow-400" : color === "blue" ? "text-blue-400" : "text-emerald-400";
  const dot = color === "yellow" ? "bg-yellow-400" : color === "blue" ? "bg-blue-400" : "bg-emerald-400";
  const badge = color === "yellow" ? "bg-yellow-500 text-black" : color === "blue" ? "bg-blue-500 text-white" : "bg-emerald-600 text-white";
  return (
    <div className={`border-r border-gray-800 last:border-r-0 flex flex-col`}>
      <div className={`${bg} border-b ${border} px-4 py-3 flex items-center gap-2`}>
        <div className={`w-2.5 h-2.5 rounded-full ${dot} animate-pulse`}></div>
        <h2 className={`font-bold ${text} uppercase tracking-widest text-xs`}>{title}</h2>
        <span className={`ml-auto ${badge} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}>{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {count === 0 ? (
          <div className={`text-center text-gray-600 py-16 ${text}/30`}>
            {emptyIcon}
            <p className="text-sm">{emptyText}</p>
          </div>
        ) : children}
      </div>
    </div>
  );
}

function OrderCard({
  order, accentColor, action, onDelete
}: {
  order: Order;
  accentColor: "yellow" | "blue" | "green";
  action: React.ReactNode;
  onDelete?: (id: number) => void;
}) {
  const mins = minutesAgo(order.createdAt);
  const headerBg = accentColor === "yellow" ? "bg-gray-800/60" : accentColor === "blue" ? "bg-blue-900/30" : "bg-emerald-900/30";
  const numberColor = accentColor === "yellow" ? "text-yellow-400" : accentColor === "blue" ? "text-blue-400" : "text-emerald-400";
  const qtyBg = accentColor === "yellow" ? "bg-primary" : accentColor === "blue" ? "bg-blue-600" : "bg-emerald-700";
  const borderColor = accentColor === "yellow" ? "border-gray-700" : accentColor === "blue" ? "border-blue-700/50" : "border-emerald-700/50";

  return (
    <div className={`bg-gray-900 rounded-xl border ${borderColor} overflow-hidden`}>
      <div className={`flex items-center justify-between px-3 py-2 ${headerBg}`}>
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold ${numberColor} text-base`}>#{order.id}</span>
          {order.isTest && (
            <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded font-mono">TEST</span>
          )}
          <span className="text-white font-semibold text-sm truncate max-w-[120px]">
            {order.customerName.replace("[TEST] ", "")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${timeColor(mins)} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
            {mins}m
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(order.id)}
              className="p-1 text-gray-600 hover:text-red-400 transition-colors"
              title="Delete test order"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="p-3">
        {order.estimatedReadyAt && (
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Ready by {formatTime(order.estimatedReadyAt)}
          </div>
        )}
        <ul className="space-y-1.5 mb-3">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <span className={`${qtyBg} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
                {item.quantity}
              </span>
              <div>
                <span className="text-white font-medium text-sm leading-tight">{item.menuItemName}</span>
                {item.specialInstructions && (
                  <p className="text-yellow-300 text-xs mt-0.5">⚠ {item.specialInstructions}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {order.specialInstructions && !order.isTest && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1.5 mb-3 text-yellow-300 text-xs">
            {order.specialInstructions}
          </div>
        )}
        {order.customerPhone && (
          <div className="text-xs text-gray-500 mb-2">{order.customerPhone}</div>
        )}
        {action}
      </div>
    </div>
  );
}
