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
  compact?: boolean;
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
  label = "Jump to",
  className,
  compact = false,
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
      const stickyOffset = readOffsetVariable("--section-nav-offset", 220);
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
    <section
      className={cn(
        "sticky top-[var(--site-header-height)] z-40 border-y border-[rgba(79,50,34,0.12)] bg-[rgba(247,241,232,0.9)] shadow-[0_18px_40px_rgba(66,43,30,0.08)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
            <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#7d5f4d]">
              {label}
            </span>
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200",
                      compact ? "text-[0.82rem]" : "text-sm",
                      isActive
                        ? "border-[#7e4330] bg-[#7e4330] text-white shadow-[0_10px_22px_rgba(126,67,48,0.22)]"
                        : "border-[rgba(79,50,34,0.15)] bg-white/85 text-[#3b2b22] hover:border-[#c58968] hover:text-[#7e4330]",
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {cta ? <div className="shrink-0">{cta}</div> : null}
        </div>
      </div>
    </section>
  );
}
