import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type StickySectionNavItem = {
  id: string;
  label: string;
};

type StickySectionNavProps = {
  items: StickySectionNavItem[];
  label?: string;
  className?: string;
  cta?: ReactNode;
};

function readOffsetVariable(name: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
    .replace("px", "");
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export function StickySectionNav({
  items,
  label = "On this page",
  className,
  cta,
}: StickySectionNavProps) {
  const initialId = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : window.location.hash.replace("#", ""),
    [],
  );
  const [activeId, setActiveId] = useState(initialId || items[0]?.id);
  const [elevated, setElevated] = useState(false);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const itemIdKey = items.map((item) => item.id).join(",");

  useEffect(() => {
    if (!itemIdKey) return;

    const updateActive = () => {
      const list = itemsRef.current;
      if (!list.length) return;
      const stickyOffset = readOffsetVariable("--section-nav-offset", 200);
      let current = list[0].id;

      list.forEach((item) => {
        const section = document.getElementById(item.id);
        if (!section) return;
        if (section.getBoundingClientRect().top - stickyOffset <= 0) {
          current = item.id;
        }
      });

      setActiveId(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [itemIdKey]);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!items.length) return null;

  return (
    <nav
      aria-label={label}
      className={cn(
        "public-sticky-section-nav sticky top-[var(--site-header-height)] z-40 border-b border-[hsla(32,16%,12%,0.1)] bg-[hsla(42,36%,97%,0.97)] text-[hsl(var(--foreground))] backdrop-blur-md backdrop-saturate-150 transition-shadow duration-200",
        elevated &&
          "shadow-[0_8px_28px_-10px_rgba(24,16,10,0.12)]",
        className,
      )}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex min-h-11 items-center justify-between gap-3 py-1.5">
          <div className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pr-1 sm:gap-1.5">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative shrink-0 rounded-full px-2.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors sm:px-3 sm:text-[12px] sm:tracking-[0.12em]",
                    isActive
                      ? "bg-[hsl(var(--primary))]/12 text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--primary))]/35"
                      : "text-[hsl(var(--muted-foreground))] hover:bg-[hsla(32,28%,88%,0.65)] hover:text-[hsl(var(--foreground))]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsla(42,36%,97%)]",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          {cta ? (
            <div className="flex shrink-0 items-center pl-0.5">{cta}</div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
