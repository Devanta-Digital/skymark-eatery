import { ReactNode, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (!items.length) return;

    const updateActive = () => {
      const stickyOffset = readOffsetVariable("--section-nav-offset", 200);
      let current = items[0].id;

      items.forEach((item) => {
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
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky top-[var(--site-header-height)] z-40 border-b border-white/10 bg-[hsla(220,22%,8%,0.92)] text-slate-300 backdrop-blur-md",
        className,
      )}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div className="scrollbar-none flex min-w-0 flex-1 items-end gap-0 overflow-x-auto sm:gap-0.5">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative shrink-0 border-b-2 px-2 pb-2 pt-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-2.5 sm:text-[12px] sm:tracking-[0.14em]",
                    isActive
                      ? "border-[hsl(var(--primary))] text-white"
                      : "border-transparent text-slate-400 hover:text-[hsl(var(--primary))]",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          {cta ? (
            <div className="flex shrink-0 items-center pb-1">{cta}</div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
