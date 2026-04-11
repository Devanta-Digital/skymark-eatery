import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Menu as MenuIcon, UtensilsCrossed, Star, DollarSign, LogOut, Crown, Sparkles, Settings, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu Management", icon: MenuIcon },
  { href: "/admin/specials", label: "Daily Specials", icon: Star },
  { href: "/admin/finance", label: "Finance (A/R · A/P)", icon: DollarSign },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Crown },
  { href: "/admin/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/kitchen", label: "Kitchen Display", icon: ChefHat, external: true },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <img src="/logo.webp" alt="Skymark Eatery" className="h-10 w-auto object-contain" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Admin Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const inner = (
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.label}
                {item.href === "/admin/subscriptions" && (
                  <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-1.5 py-0.5 font-medium">Admin</span>
                )}
                {(item as any).external && (
                  <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-1.5 py-0.5 font-medium">↗</span>
                )}
              </div>
            );
            return (item as any).external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">{inner}</a>
            ) : (
              <Link key={item.href} href={item.href}>{inner}</Link>
            );
          })}
        </nav>

        {user && (
          <div className="px-4 pb-2">
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/">
              <LogOut className="w-4 h-4 mr-2" />
              Exit to Site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold">Skymark Admin</h2>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <LogOut className="w-5 h-5" />
            </Link>
          </Button>
        </header>

        {/* Mobile Nav (horizontal scroll) */}
        <nav className="md:hidden flex overflow-x-auto p-2 border-b border-border bg-background hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors mr-2",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
