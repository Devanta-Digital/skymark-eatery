import { ReactNode, useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ShoppingBag, Menu, MapPin, Phone, Clock, Mail, Instagram, User, LogOut, ChefHat } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: ReactNode }) {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollY = useRef(0);

  const isStaff = user?.role === "staff";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current + 10) {
        setNavHidden(true);
      } else if (y < lastScrollY.current - 10) {
        setNavHidden(false);
      }
      setShowBackToTop(y > 420);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background shadow-sm transition-transform duration-300 ease-in-out ${
          navHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.webp" alt="Skymark Eatery by Caffé É Pranzo" className="h-16 w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/menu" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Menu
              </Link>
              <Link href="/catering" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Catering
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary hover:bg-primary/10">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">Open cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col border-l-border">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl">Your Order</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto py-6">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                      <p>Your cart is empty.</p>
                      <SheetTrigger asChild>
                        <Button variant="outline" asChild>
                          <Link href="/menu">Browse Menu</Link>
                        </Button>
                      </SheetTrigger>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.menuItem.id} className="flex gap-4 border-b border-border pb-4 last:border-0">
                          {item.menuItem.imageUrl && (
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="h-20 w-20 object-cover rounded-md border border-border"
                            />
                          )}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between font-serif">
                                <h4 className="font-medium">{item.menuItem.name}</h4>
                                <span className="font-medium">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                              </div>
                              {item.specialInstructions && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-border rounded-md">
                                <button
                                  className="px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-md"
                                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                <button
                                  className="px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-md"
                                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.menuItem.id)}
                                className="text-xs text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="border-t border-border pt-4 mt-auto">
                    <div className="flex justify-between text-lg font-serif font-bold mb-4">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <SheetTrigger asChild>
                      <Button className="w-full font-medium text-lg" size="lg" asChild>
                        <Link href="/checkout">Proceed to Checkout</Link>
                      </Button>
                    </SheetTrigger>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                  <DropdownMenuSeparator />
                  {(isAdmin || isStaff) && (
                    <>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => { window.location.href = "/admin"; }}>
                          <ChefHat className="w-4 h-4 mr-2" /> Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => { window.location.href = "/kitchen"; }}>
                        <ChefHat className="w-4 h-4 mr-2" /> Kitchen Display
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { window.location.href = "/order-board"; }}>
                        <ChefHat className="w-4 h-4 mr-2" /> Order Status Board
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full py-6">
                  <img src="/logo.webp" alt="Skymark Eatery" className="h-14 w-auto object-contain mb-8" />
                  <nav className="flex flex-col gap-4">
                    <Link href="/" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </Link>
                    <Link href="/menu" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Menu
                    </Link>
                    <Link href="/catering" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Catering
                    </Link>
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link href="/admin" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Admin Dashboard
                          </Link>
                        )}
                        {(isAdmin || isStaff) && (
                          <>
                            <Link href="/kitchen" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              Kitchen Display
                            </Link>
                            <Link href="/order-board" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              Order Status Board
                            </Link>
                          </>
                        )}
                        <button className="text-left text-lg font-serif font-medium text-destructive hover:text-destructive/80 transition-colors" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                        <Link href="/signup" className="text-lg font-serif font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                          Create Account
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-20">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-primary text-primary-foreground mt-auto">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="inline-block bg-white rounded-lg px-4 py-2 mb-4">
                <img src="/logo.webp" alt="Skymark Eatery by Caffé É Pranzo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-primary-foreground/75 max-w-xs text-sm leading-relaxed">
                Authentic Italian-inspired cuisine served with warmth and tradition in the heart of Mississauga.
              </p>
              <a href="https://www.instagram.com/skymark___eatery/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-primary-foreground/75 hover:text-primary-foreground transition-colors text-sm">
                <Instagram className="w-4 h-4" />
                @skymark___eatery
              </a>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-lg mb-4">Visit Us</h4>
              <div className="space-y-3 text-primary-foreground/75 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <address className="not-italic">
                    2630 Skymark Ave., Unit 102<br />
                    Mississauga, ON L4W 5A4
                  </address>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <a href="tel:+19052065550" className="hover:text-primary-foreground transition-colors">(905) 206-5550</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href="mailto:skymarkeatery@gmail.com" className="hover:text-primary-foreground transition-colors">skymarkeatery@gmail.com</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-lg mb-4">Hours</h4>
              <div className="flex items-start gap-2 text-primary-foreground/75 text-sm">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p>Monday – Friday</p>
                  <p className="font-semibold text-primary-foreground">7:30 AM – 4:30 PM</p>
                  <p className="mt-2 text-xs text-primary-foreground/60">Closed weekends & holidays</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
            <p>© {new Date().getFullYear()} Skymark Eatery by Caffé É Pranzo. All rights reserved.</p>
            <nav className="flex items-center gap-4">
              <Link href="/menu" className="hover:text-primary-foreground transition-colors">Menu</Link>
              <Link href="/catering" className="hover:text-primary-foreground transition-colors">Catering</Link>
              <a href="/#contact" className="hover:text-primary-foreground transition-colors">Contact</a>
              <Link href="/admin-login" className="hover:text-primary-foreground transition-colors">Admin Login</Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        🍝
      </button>
    </div>
  );
}
