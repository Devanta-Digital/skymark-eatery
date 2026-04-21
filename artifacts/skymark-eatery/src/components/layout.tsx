import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUp,
  ChefHat,
  Clock,
  Instagram,
  LogOut,
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

/** Sticky in-page section rail height for anchor offset (see sticky-section-nav). */
const SECTION_NAV_RAIL_PX = 34;

export function Layout({ children }: { children: ReactNode }) {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [location] = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const scrollLastY = useRef(0);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  const isStaff = user?.role === "staff";
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollLastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - scrollLastY.current;
      scrollLastY.current = y;
      setHeaderCompact(y > 16);
      if (y < 48) {
        setHeaderHidden(false);
        return;
      }
      if (delta > 8) setHeaderHidden(true);
      else if (delta < -8) setHeaderHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const sync = () => {
      if (headerHidden) {
        document.documentElement.style.setProperty("--site-header-height", "0px");
        document.documentElement.style.setProperty(
          "--section-nav-offset",
          `${SECTION_NAV_RAIL_PX + 12}px`,
        );
        return;
      }
      const h = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-height", `${h}px`);
      document.documentElement.style.setProperty(
        "--section-nav-offset",
        `${h + SECTION_NAV_RAIL_PX}px`,
      );
    };
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    sync();
    return () => ro.disconnect();
  }, [headerCompact, headerHidden]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-[60] rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1f1410] shadow-lg ring-2 ring-[#8b4f39]/25 focus:not-sr-only focus:fixed focus:outline-none"
      >
        Skip to main content
      </a>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-[rgba(26,18,14,0.07)] bg-[hsla(34,38%,97%,0.92)] backdrop-blur-md transition-[transform,box-shadow] duration-300 ease-out",
          headerHidden ? "-translate-y-full shadow-none" : "translate-y-0",
          headerCompact && !headerHidden
            ? "shadow-[0_1px_0_rgba(26,18,14,0.04)]"
            : "shadow-[0_8px_24px_rgba(26,18,14,0.04)]",
        )}
      >
        <div
          className={cn(
            "container mx-auto flex max-w-6xl items-center gap-2 px-4 transition-[height] duration-200 sm:gap-3",
            headerCompact ? "h-[48px] sm:h-[50px]" : "h-[52px] sm:h-[56px]",
          )}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 sm:gap-2.5"
          >
            <img
              src="/logo.webp"
              alt={BUSINESS_INFO.primaryName}
              className={cn(
                "h-auto w-auto object-contain transition-all duration-200",
                headerCompact ? "h-8 sm:h-8" : "h-9 sm:h-10",
              )}
            />
            <div className="hidden min-w-0 sm:block">
              <div
                className={cn(
                  "font-serif leading-none tracking-tight text-[#1f1410] transition-all duration-200",
                  headerCompact
                    ? "text-[1.05rem] sm:text-[1.12rem]"
                    : "text-[1.12rem] sm:text-[1.22rem]",
                )}
              >
                {BUSINESS_INFO.secondaryName}
              </div>
              <div className="font-sans text-[0.55rem] font-medium uppercase tracking-[0.2em] text-[#7a6558]">
                by Caffe E Pranzo
              </div>
            </div>
          </Link>

          <nav className="mx-2 hidden min-w-0 flex-1 items-center justify-center gap-5 md:flex lg:gap-7">
            {NAV_LINKS.map((link) => {
              const active = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    active
                      ? "text-[#1f1410]"
                      : "text-[#6d5c50] hover:text-[#8b3d2c]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden h-4 w-px shrink-0 bg-[rgba(26,18,14,0.1)] lg:block" />

          <div className="hidden shrink-0 flex-col text-right text-[10px] leading-tight text-[#6d5c50] lg:flex">
            <a
              href={BUSINESS_INFO.phoneHref}
              className="font-semibold text-[#1f1410] hover:text-[#8b3d2c]"
            >
              {BUSINESS_INFO.phone}
            </a>
            <span className="mt-0.5 font-medium uppercase tracking-[0.1em] text-[#9a8a7e]">
              Mon–Fri · 7:30a–4:30p
            </span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Link
              href="/catering#inquire"
              className="hidden px-2 text-[11px] font-semibold text-[#6d5c50] transition-colors hover:text-[#1f1410] xl:inline"
            >
              Catering quote
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="hidden h-8 px-2.5 text-[11px] font-semibold text-[#1f1410] hover:bg-[rgba(26,18,14,0.05)] md:inline-flex"
              asChild
            >
              <Link href="/menu">View menu</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-md text-[#1f1410] hover:bg-[rgba(26,18,14,0.06)]"
                >
                  <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8b3d2c] px-1 text-[9px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">Open cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col border-l border-[rgba(26,18,14,0.08)] bg-[hsl(34,42%,97%)] sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl text-[#1f1410]">
                    Your order
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-auto py-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-[#6d5c50]">
                      <ShoppingBag className="h-12 w-12 opacity-15" />
                      <p className="text-sm">Your cart is empty.</p>
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
                          className="flex gap-4 border-b border-[rgba(26,18,14,0.08)] pb-4 last:border-0"
                        >
                          {item.menuItem.imageUrl && (
                            <img
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              className="h-20 w-20 rounded-md border border-[rgba(26,18,14,0.08)] object-cover"
                            />
                          )}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between gap-3 font-serif text-[#1f1410]">
                                <h4 className="font-medium">{item.menuItem.name}</h4>
                                <span className="font-medium tabular-nums">
                                  $
                                  {(
                                    item.menuItem.price * item.quantity
                                  ).toFixed(2)}
                                </span>
                              </div>
                              {item.specialInstructions && (
                                <p className="mt-1 line-clamp-2 text-xs text-[#6d5c50]">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-md border border-[rgba(26,18,14,0.12)] bg-white">
                                <button
                                  type="button"
                                  className="rounded-l-md px-3 py-1 text-[#6d5c50] transition-colors hover:bg-[#f0e8df] hover:text-[#1f1410]"
                                  onClick={() =>
                                    updateQuantity(
                                      item.menuItem.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  aria-label={`Decrease quantity for ${item.menuItem.name}`}
                                >
                                  −
                                </button>
                                <span className="px-2 text-sm font-medium text-[#1f1410]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="rounded-r-md px-3 py-1 text-[#6d5c50] transition-colors hover:bg-[#f0e8df] hover:text-[#1f1410]"
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
                                type="button"
                                onClick={() => removeItem(item.menuItem.id)}
                                className="text-xs font-medium text-[#8b3d2c] hover:underline"
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
                  <div className="mt-auto border-t border-[rgba(26,18,14,0.08)] pt-4">
                    <div className="mb-4 flex justify-between font-serif text-lg font-bold text-[#1f1410]">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <SheetTrigger asChild>
                      <Button
                        className="w-full bg-[#8b3d2c] text-lg text-white hover:bg-[#722f22]"
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
                    variant="ghost"
                    size="sm"
                    className="hidden h-8 items-center gap-1.5 rounded-md px-2 text-[#6d5c50] hover:bg-[rgba(26,18,14,0.05)] hover:text-[#1f1410] md:flex"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="max-w-20 truncate text-[11px] font-medium">
                      {user.name.split(" ")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 border-[rgba(26,18,14,0.1)] bg-[hsl(34,42%,97%)]"
                >
                  <div className="px-2 py-1.5 text-xs text-[#6d5c50]">
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
                          Admin dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = "/kitchen";
                        }}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Kitchen display
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = "/order-board";
                        }}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Order board
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden h-8 rounded-md px-2 text-[11px] font-medium text-[#6d5c50] hover:bg-[rgba(26,18,14,0.05)] hover:text-[#1f1410] md:inline-flex"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md text-[#1f1410] md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(100%,380px)] border-l border-[rgba(26,18,14,0.08)] bg-[hsl(34,42%,97%)]"
              >
                <div className="flex h-full flex-col py-2">
                  <div className="border-b border-[rgba(26,18,14,0.08)] pb-5">
                    <img
                      src="/logo.webp"
                      alt={BUSINESS_INFO.primaryName}
                      className="h-11 w-auto object-contain"
                    />
                    <p className="mt-3 font-serif text-xl text-[#1f1410]">
                      {BUSINESS_INFO.secondaryName}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b6f5c]">
                      Italian takeout &amp; catering · Mississauga
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-md px-2 py-2.5 font-serif text-lg text-[#1f1410] transition-colors hover:bg-[rgba(26,18,14,0.05)]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Button
                      className="h-11 rounded-md bg-[#8b3d2c] font-sans text-sm text-white hover:bg-[#722f22]"
                      asChild
                    >
                      <Link
                        href="/menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Order pickup
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 rounded-md border-[rgba(26,18,14,0.14)] bg-white font-sans text-sm"
                      asChild
                    >
                      <Link
                        href="/catering#inquire"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Request catering
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-auto space-y-3 border-t border-[rgba(26,18,14,0.08)] pt-6 text-sm text-[#5c4d42]">
                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="flex items-center gap-2 font-medium text-[#1f1410]"
                    >
                      <Phone className="h-4 w-4 text-[#8b3d2c]" />
                      {BUSINESS_INFO.phone}
                    </a>
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3d2c]" />
                      <span>{BUSINESS_INFO.hoursLabel}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3d2c]" />
                      <span>
                        {BUSINESS_INFO.addressLine1}
                        <br />
                        {BUSINESS_INFO.addressLine2}
                      </span>
                    </div>
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block text-[#1f1410]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Admin
                          </Link>
                        )}
                        {(isAdmin || isStaff) && (
                          <>
                            <Link
                              href="/kitchen"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Kitchen
                            </Link>
                            <Link
                              href="/order-board"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Order board
                            </Link>
                          </>
                        )}
                        <button
                          type="button"
                          className="text-left text-destructive"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                    )}
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

      <footer className="border-t border-[rgba(26,18,14,0.12)] bg-[#1a120e] text-[#f2e8dc]">
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_0.45fr_0.45fr_0.55fr]">
            <div>
              <img
                src="/logo.webp"
                alt={BUSINESS_INFO.primaryName}
                className="h-12 w-auto object-contain opacity-95"
              />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f2e8dc]/75">
                {BUSINESS_INFO.primaryName} — Italian takeout, weekday lunch,
                and catering for offices and events on Skymark Ave in
                Mississauga, a short hop from Pearson when timing matters.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  className="h-9 rounded-md bg-[#b85c40] px-4 text-sm text-white hover:bg-[#9a4d35]"
                  asChild
                >
                  <Link href="/menu">Order pickup</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-9 rounded-md border-white/20 bg-transparent px-4 text-sm text-[#f2e8dc] hover:bg-white/10"
                  asChild
                >
                  <Link href="/catering#inquire">Catering quote</Link>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a995]">
                Explore
              </h4>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-[#f2e8dc]/72">
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
              <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a995]">
                Contact
              </h4>
              <div className="mt-3 space-y-2 text-sm text-[#f2e8dc]/72">
                <address className="not-italic leading-relaxed">
                  {BUSINESS_INFO.addressLine1}
                  <br />
                  {BUSINESS_INFO.addressLine2}
                </address>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="block font-medium text-white/95 hover:text-white"
                >
                  {BUSINESS_INFO.phone}
                </a>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="block hover:text-white"
                >
                  {BUSINESS_INFO.email}
                </a>
                <a
                  href={BUSINESS_INFO.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                  @skymark___eatery
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a995]">
                Hours
              </h4>
              <div className="mt-3 space-y-2 text-sm text-[#f2e8dc]/72">
                <p className="font-medium text-white/95">
                  Monday–Friday · 7:30a–4:30p
                </p>
                <p className="text-xs text-[#f2e8dc]/55">
                  Closed weekends and public holidays
                </p>
                <a
                  href={BUSINESS_INFO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:text-white"
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  Directions
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#f2e8dc]/45 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {BUSINESS_INFO.primaryName}
            </p>
            <p className="max-w-xl md:text-right">{BUSINESS_INFO.tagline}</p>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#8b3d2c] text-white shadow-lg transition-all duration-300 hover:bg-[#722f22]",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
