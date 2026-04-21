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
        "sticky top-[var(--site-header-height)] z-40 border-b border-[rgba(36,24,18,0.14)] bg-[rgba(252,249,244,0.92)] shadow-[0_12px_32px_rgba(36,24,18,0.07)] backdrop-blur-md backdrop-saturate-150",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="shrink-0 pt-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6b5346]">
              {label}
            </span>
            <div className="scrollbar-none flex min-w-0 gap-0 overflow-x-auto border-t border-[rgba(36,24,18,0.08)] pt-2 sm:border-t-0 sm:pt-0">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative shrink-0 px-3 py-2 pb-2.5 font-sans text-[13px] font-medium transition-colors sm:px-4",
                      isActive
                        ? "text-[#1a120e]"
                        : "text-[#5c4a40] hover:text-[#1a120e]",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-x-1 bottom-0 h-0.5 rounded-full transition-opacity duration-200",
                        isActive ? "bg-[#9c4f38] opacity-100" : "opacity-0",
                      )}
                      aria-hidden
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {cta ? (
            <div className="flex shrink-0 items-center border-t border-[rgba(36,24,18,0.08)] pt-2 sm:border-t-0 sm:border-l sm:border-[rgba(36,24,18,0.08)] sm:pl-4 sm:pt-0">
              {cta}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
