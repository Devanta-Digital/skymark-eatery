import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUp,
  ChefHat,
  Clock,
  Instagram,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { BUSINESS_INFO } from "@/content/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [location] = useLocation();

  const isStaff = user?.role === "staff";
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 480);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-[60] rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#2d1e18] shadow-lg ring-2 ring-[#8b4f39]/30 focus:not-sr-only focus:fixed focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(79,50,34,0.1)] bg-[rgba(251,246,239,0.92)] shadow-[0_18px_44px_rgba(48,32,22,0.08)] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-[#2d1e18] text-[#f8f0e5]">
          <div className="container mx-auto flex min-h-9 items-center justify-between gap-4 px-4 py-2 text-[11px] sm:text-xs">
            <div className="flex min-w-0 items-center gap-4 text-[#f8f0e5]/78">
              <a
                href={BUSINESS_INFO.phoneHref}
                className="inline-flex items-center gap-2 whitespace-nowrap hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                {BUSINESS_INFO.phone}
              </a>
              <span className="hidden items-center gap-2 md:inline-flex">
                <Clock className="h-3.5 w-3.5" />
                {BUSINESS_INFO.hoursLabel}
              </span>
            </div>
            <div className="hidden text-right text-[#f8f0e5]/68 lg:block">
              Italian eatery, takeout, and catering in Mississauga
            </div>
          </div>
        </div>

        <div className="container mx-auto flex h-[82px] items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <img
                src="/logo.webp"
                alt={BUSINESS_INFO.primaryName}
                className="h-12 w-auto shrink-0 object-contain sm:h-14"
              />
              <div className="hidden min-[460px]:block">
                <div className="font-serif text-[1.55rem] leading-none text-[#2d1e18]">
                  {BUSINESS_INFO.secondaryName}
                </div>
                <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b654e]">
                  By Caffe E Pranzo
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((link) => {
                const active = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      active
                        ? "text-[#2d1e18]"
                        : "text-[#6d5748] hover:text-[#8b4f39]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden rounded-full border-[rgba(45,30,24,0.12)] bg-white/80 px-4 text-[#2d1e18] lg:inline-flex"
              asChild
            >
              <Link href="/catering#inquire">Request Catering</Link>
            </Button>
            <Button
              size="sm"
              className="hidden rounded-full bg-[#8b4f39] px-5 text-white hover:bg-[#75412f] md:inline-flex"
              asChild
            >
              <Link href="/menu">Order Pickup</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full border-[rgba(45,30,24,0.12)] bg-white/82 hover:bg-white"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b4f39] text-[10px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">Open cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col border-l-[rgba(79,50,34,0.12)] bg-[#fbf6ef] sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl text-[#2d1e18]">
                    Your Order
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto py-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-[#766357]">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                      <p>Your cart is empty.</p>
                      <SheetTrigger asChild>
                        <Button variant="outline" asChild>
                          <Link href="/menu">Browse the menu</Link>
                        </Button>
                      </SheetTrigger>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="flex gap-4 border-b border-[rgba(79,50,34,0.08)] pb-4 last:border-0"
                        >
                          {item.menuItem.imageUrl && (
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="h-20 w-20 rounded-[1.1rem] border border-[rgba(79,50,34,0.08)] object-cover"
                            />
                          )}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between gap-3 font-serif text-[#2d1e18]">
                                <h4 className="font-medium">
                                  {item.menuItem.name}
                                </h4>
                                <span className="font-medium">
                                  $
                                  {(
                                    item.menuItem.price * item.quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                              {item.specialInstructions && (
                                <p className="mt-1 line-clamp-2 text-xs text-[#766357]">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-[rgba(79,50,34,0.14)] bg-white">
                                <button
                                  className="rounded-l-full px-3 py-1 text-[#766357] transition-colors hover:bg-[#f4eadf] hover:text-[#2d1e18]"
                                  onClick={() =>
                                    updateQuantity(
                                      item.menuItem.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  aria-label={`Decrease quantity for ${item.menuItem.name}`}
                                >
                                  -
                                </button>
                                <span className="px-2 text-sm font-medium text-[#2d1e18]">
                                  {item.quantity}
                                </span>
                                <button
                                  className="rounded-r-full px-3 py-1 text-[#766357] transition-colors hover:bg-[#f4eadf] hover:text-[#2d1e18]"
                                  onClick={() =>
                                    updateQuantity(
                                      item.menuItem.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  aria-label={`Increase quantity for ${item.menuItem.name}`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.menuItem.id)}
                                className="text-xs font-medium text-[#8b4f39] hover:underline"
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
                  <div className="mt-auto border-t border-[rgba(79,50,34,0.08)] pt-4">
                    <div className="mb-4 flex justify-between font-serif text-lg font-bold text-[#2d1e18]">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <SheetTrigger asChild>
                      <Button
                        className="w-full bg-[#8b4f39] text-lg text-white hover:bg-[#75412f]"
                        size="lg"
                        asChild
                      >
                        <Link href="/checkout">Proceed to checkout</Link>
                      </Button>
                    </SheetTrigger>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden items-center gap-2 rounded-full border-[rgba(45,30,24,0.12)] bg-white/80 md:flex"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-24 truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 border-[rgba(79,50,34,0.12)] bg-[#fbf6ef]"
                >
                  <div className="px-2 py-1.5 text-xs text-[#766357]">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  {(isAdmin || isStaff) && (
                    <>
                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => {
                            window.location.href = "/admin";
                          }}
                        >
                          <ChefHat className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = "/kitchen";
                        }}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Kitchen Display
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = "/order-board";
                        }}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Order Board
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden rounded-full text-[#6d5748] hover:text-[#2d1e18] md:inline-flex"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#2d1e18] md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[320px] border-r-[rgba(79,50,34,0.12)] bg-[#fbf6ef] sm:w-[380px]"
              >
                <div className="flex h-full flex-col py-6">
                  <div className="rounded-[1.75rem] border border-[rgba(79,50,34,0.1)] bg-white/88 p-5 shadow-sm">
                    <img
                      src="/logo.webp"
                      alt={BUSINESS_INFO.primaryName}
                      className="h-14 w-auto object-contain"
                    />
                    <div className="mt-4 font-serif text-2xl text-[#2d1e18]">
                      {BUSINESS_INFO.secondaryName}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#6d5748]">
                      Italian takeout, weekday lunch, and catering from
                      Mississauga.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Button
                      className="rounded-full bg-[#8b4f39] text-white hover:bg-[#75412f]"
                      asChild
                    >
                      <Link
                        href="/menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Order Pickup
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-[rgba(45,30,24,0.12)] bg-white/82"
                      asChild
                    >
                      <Link
                        href="/catering#inquire"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Request Catering
                      </Link>
                    </Button>
                  </div>

                  <nav className="mt-8 flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-serif text-[#2d1e18] transition-colors hover:text-[#8b4f39]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="text-lg font-serif text-[#2d1e18] hover:text-[#8b4f39]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {(isAdmin || isStaff) && (
                          <>
                            <Link
                              href="/kitchen"
                              className="text-lg font-serif text-[#2d1e18] hover:text-[#8b4f39]"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Kitchen Display
                            </Link>
                            <Link
                              href="/order-board"
                              className="text-lg font-serif text-[#2d1e18] hover:text-[#8b4f39]"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Order Board
                            </Link>
                          </>
                        )}
                        <button
                          className="text-left text-lg font-serif text-destructive"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="text-lg font-serif text-[#2d1e18] hover:text-[#8b4f39]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </nav>

                  <div className="mt-auto rounded-[1.75rem] border border-[rgba(79,50,34,0.1)] bg-[#f4eadf] p-5 text-sm text-[#6d5748]">
                    <div className="mb-3 font-serif text-lg text-[#2d1e18]">
                      Visit us
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8b4f39]" />
                        <span>
                          {BUSINESS_INFO.addressLine1}
                          <br />
                          {BUSINESS_INFO.addressLine2}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#8b4f39]" />
                        <span>{BUSINESS_INFO.hoursLabel}</span>
                      </div>
                      <a
                        href={BUSINESS_INFO.phoneHref}
                        className="flex items-center gap-2 text-[#2d1e18] hover:text-[#8b4f39]"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-[#8b4f39]" />
                        <span>{BUSINESS_INFO.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-screen flex-col pt-[var(--site-header-height)] outline-none"
      >
        {children}
      </main>

      <footer className="border-t border-[rgba(79,50,34,0.14)] bg-[#241813] text-[#f8f0e5]">
        <div className="container mx-auto px-4 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.9fr_0.95fr]">
            <div>
              <img
                src="/logo.webp"
                alt={BUSINESS_INFO.primaryName}
                className="h-14 w-auto object-contain"
              />
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#f8f0e5]/72">
                {BUSINESS_INFO.primaryName} serves weekday breakfast and lunch,
                takeout, trays, platters, and catering for Mississauga offices,
                family gatherings, and hosted events.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-[#8b4f39] text-white hover:bg-[#75412f]"
                  asChild
                >
                  <Link href="/menu">Order Pickup</Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/14 bg-white/5 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/catering#inquire">Request Catering</Link>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold">Explore</h4>
              <nav className="mt-4 flex flex-col gap-3 text-sm text-[#f8f0e5]/72">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold">Contact</h4>
              <div className="mt-4 space-y-3 text-sm text-[#f8f0e5]/72">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <address className="not-italic">
                    {BUSINESS_INFO.addressLine1}
                    <br />
                    {BUSINESS_INFO.addressLine2}
                  </address>
                </div>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{BUSINESS_INFO.email}</span>
                </a>
                <a
                  href={BUSINESS_INFO.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Instagram className="h-4 w-4 shrink-0" />
                  <span>@skymark___eatery</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold">Hours</h4>
              <div className="mt-4 space-y-3 text-sm text-[#f8f0e5]/72">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p>Monday to Friday</p>
                    <p className="font-semibold text-white">
                      7:30 AM - 4:30 PM
                    </p>
                    <p className="mt-1 text-xs text-[#f8f0e5]/48">
                      Closed weekends and public holidays
                    </p>
                  </div>
                </div>
                <a
                  href={BUSINESS_INFO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#f8f0e5]/72 transition-colors hover:text-white"
                >
                  <MapPin className="h-4 w-4" />
                  Get directions
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#f8f0e5]/50 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {BUSINESS_INFO.primaryName}. All
              rights reserved.
            </p>
            <p>{BUSINESS_INFO.tagline}</p>
          </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#8b4f39] text-white shadow-[0_18px_34px_rgba(139,79,57,0.28)] transition-all duration-300 hover:scale-105 hover:bg-[#75412f]",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
