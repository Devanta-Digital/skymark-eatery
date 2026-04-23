import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUp,
  Clock,
  MapPin,
  Menu,
  Phone,
} from "lucide-react";
import { BUSINESS_INFO } from "@/content/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND_LOGO } from "@/lib/branding";
import { isVisualQaCapture } from "@/lib/visual-qa";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Visit" },
];

/** Sticky in-page section rail height for anchor offset (see sticky-section-nav). */
const SECTION_NAV_RAIL_PX = 34;

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const visualQa = isVisualQaCapture();
  const [location] = useLocation();
  /** Path without query/hash so /catering#inquire highlights Catering. */
  const pathOnly = location.split(/[?#]/)[0] || location;
  const headerRef = useRef<HTMLElement>(null);
  const scrollLastY = useRef(0);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  const isPublicRoute =
    pathOnly === "/" ||
    pathOnly.startsWith("/menu") ||
    pathOnly.startsWith("/catering") ||
    pathOnly.startsWith("/contact");

  const isContactPage = pathOnly === "/contact";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-[60] rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-2 ring-[hsl(var(--primary))]/45 focus:not-sr-only focus:fixed focus:outline-none"
      >
        Skip to main content
      </a>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex flex-col border-b border-white/[0.07] bg-[hsla(28,12%,8%,0.9)] text-slate-200 backdrop-blur-[14px] backdrop-saturate-125 transition-[transform,box-shadow] duration-300 ease-out",
          headerHidden ? "-translate-y-full shadow-none" : "translate-y-0",
          headerCompact && !headerHidden
            ? "shadow-[0_1px_0_rgba(255,255,255,0.05)]"
            : "shadow-[0_8px_32px_rgba(0,0,0,0.24)]",
        )}
      >
        <div className="flex h-0.5 w-full shrink-0" aria-hidden>
          <span className="flex-1 bg-[hsl(152_52%_34%)]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[hsl(var(--primary))]" />
        </div>
        <div
          className={cn(
            "container mx-auto flex max-w-6xl items-center gap-1.5 px-3 transition-[height] duration-200 sm:gap-2 sm:px-4",
            headerCompact ? "h-[48px] sm:h-[50px]" : "h-[52px] sm:h-[56px]",
          )}
        >
          <Link
            href="/"
            aria-label={`${BUSINESS_INFO.primaryName} home`}
            className="flex shrink-0 items-center"
          >
            <img
              src={BRAND_LOGO.onDark}
              alt={BUSINESS_INFO.primaryName}
              className={cn(
                "h-auto w-auto object-contain object-left contrast-[1.06] saturate-[1.12] transition-all duration-200",
                headerCompact ? "h-9 sm:h-10" : "h-10 sm:h-[2.85rem]",
              )}
            />
          </Link>

          <nav className="mx-1.5 hidden min-w-0 flex-1 items-center justify-center gap-4 md:flex lg:gap-5">
            {NAV_LINKS.map((link) => {
              const active = pathOnly === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-[hsl(var(--primary))]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <a
            href={BUSINESS_INFO.phoneHref}
            className="hidden shrink-0 items-center gap-1.5 rounded-md border border-white/[0.14] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[hsl(var(--primary))]/55 hover:bg-[hsl(var(--primary))]/15 hover:text-white md:inline-flex"
            aria-label={`Call the kitchen at ${BUSINESS_INFO.phone}`}
          >
            <Phone className="h-3.5 w-3.5 text-[hsl(var(--primary))]" aria-hidden />
            <span className="hidden lg:inline">{BUSINESS_INFO.phone}</span>
            <span className="lg:hidden">Call</span>
          </a>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md text-slate-100 md:hidden"
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
                      src={BRAND_LOGO.onLight}
                      alt={BUSINESS_INFO.primaryName}
                      className="h-12 w-auto object-contain"
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
                      className="h-11 rounded-md bg-[hsl(var(--primary))] font-sans text-sm text-white hover:opacity-90"
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
                        href="/catering"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Catering
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-auto space-y-3 border-t border-[rgba(26,18,14,0.08)] pt-6 text-sm text-[#5c4d42]">
                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="flex items-center gap-2 font-medium text-[#1f1410]"
                    >
                      <Phone className="h-4 w-4 text-[hsl(var(--primary))]" />
                      {BUSINESS_INFO.phone}
                    </a>
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
                      <span>{BUSINESS_INFO.hoursLabel}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
                      <span>
                        {BUSINESS_INFO.addressLine1}
                        <br />
                        {BUSINESS_INFO.addressLine2}
                      </span>
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
        className={cn(
          "flex min-h-screen flex-col pt-[var(--site-header-height)] outline-none",
          isPublicRoute ? "pb-20 md:pb-0" : "",
        )}
      >
        {children}
      </main>

      <footer className="border-t border-white/[0.08] bg-[hsla(24,8%,6%,0.98)] text-[hsl(40_24%_96%)]">
        <div className="flex h-px w-full shrink-0 opacity-80" aria-hidden>
          <span className="flex-1 bg-[hsl(152_52%_34%)]" />
          <span className="flex-1 bg-white/25" />
          <span className="flex-1 bg-[hsl(var(--primary))]" />
        </div>
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-7">
          <div
            className={cn(
              "grid gap-5 md:grid-cols-2 lg:gap-6",
              isContactPage ? "lg:grid-cols-[1.2fr_1fr]" : "lg:grid-cols-[1.2fr_0.8fr_0.9fr]",
            )}
          >
            <div>
              <img
                src={BRAND_LOGO.onDark}
                alt={BUSINESS_INFO.primaryName}
                className="h-[3.25rem] w-auto object-contain object-left contrast-[1.06] saturate-[1.12] sm:h-14"
              />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f2e8dc]/75">
                {BUSINESS_INFO.primaryName} — Italian takeout, weekday lunch,
                and catering for offices and events on Skymark Ave in
                Mississauga, a short hop from Pearson when timing matters.
              </p>
            </div>

            <div>
              <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Explore
              </h4>
              <nav className="mt-3 flex flex-col gap-1.5 text-sm text-[#f2e8dc]/72">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit py-0.5 transition-colors hover:text-white"
                  >
                    <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] bg-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 hover:bg-[length:100%_1px]">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {isContactPage ? (
              <div>
                <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  On this page
                </h4>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#f2e8dc]/72">
                  Address, hours, phone, email, map, and pickup note live above — we keep them out of the footer here so nothing repeats.
                </p>
                <a
                  href="#contact-primary"
                  className="mt-4 inline-flex w-fit text-sm font-semibold text-[hsl(var(--primary))] transition hover:text-white"
                >
                  Jump to details
                </a>
              </div>
            ) : (
              <div>
                <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Location + hours
                </h4>
                <div className="mt-3 space-y-2 text-sm text-[#f2e8dc]/72">
                  <address className="not-italic leading-relaxed">
                    {BUSINESS_INFO.addressLine1}
                    <br />
                    {BUSINESS_INFO.addressLine2}
                  </address>
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="block w-fit font-medium text-white/95 transition hover:text-[hsl(var(--primary))]"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                  <p className="font-medium text-white/95">
                    Monday–Friday · 7:30a–4:30p
                  </p>
                  <a
                    href={BUSINESS_INFO.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm transition hover:text-[hsl(var(--primary))]"
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    Directions
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-1.5 border-t border-white/10 pt-3 text-xs text-[#f2e8dc]/45 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {BUSINESS_INFO.primaryName}
            </p>
            <p className="max-w-xl md:text-right">{BUSINESS_INFO.tagline}</p>
          </div>
        </div>
      </footer>

      {visualQa ? null : (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className={cn(
            "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-white shadow-lg transition-all duration-300 hover:opacity-90",
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0",
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {isPublicRoute ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[hsla(32,18%,12%,0.08)] bg-[hsla(38,38%,98%,0.96)] px-3 py-2 shadow-[0_-4px_24px_rgba(20,14,10,0.06)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <Button className="min-h-10 flex-1 rounded-md text-xs" asChild>
              <Link href="/menu">Menu</Link>
            </Button>
            <Button
              variant="outline"
              className="min-h-10 flex-1 rounded-md border-[rgba(26,18,14,0.16)] bg-white text-xs"
              asChild
            >
              <Link href="/catering">Catering</Link>
            </Button>
            <Button
              variant="outline"
              className="min-h-10 flex-none rounded-md border-[rgba(26,18,14,0.16)] bg-white px-3 text-xs"
              asChild
              aria-label={`Call ${BUSINESS_INFO.phone}`}
            >
              <a href={BUSINESS_INFO.phoneHref}>
                <Phone className="h-4 w-4 text-[hsl(var(--primary))]" aria-hidden />
                <span className="sr-only">Call</span>
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
