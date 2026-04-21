import type { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Variants } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { isVisualQaCapture } from "@/lib/visual-qa";
import { cn } from "@/lib/utils";

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  infoLine?: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Tighter utility hero (e.g. contact): shorter image column, less vertical padding */
  density?: "default" | "compact";
  /** Optional crop / presentation class on hero image (e.g. `media-crop-hero`) */
  imageClassName?: string;
};

function isExternalHref(href: string) {
  return (
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:")
  );
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  primaryCta,
  secondaryCta,
  infoLine,
  className,
  contentClassName,
  density = "default",
  imageClassName,
}: HeroProps) {
  const compact = density === "compact";
  const qa = isVisualQaCapture();
  const motionInitial = qa ? ("visible" as const) : ("hidden" as const);
  const instantItem: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0 } },
  };
  const containerVariants: Variants = qa
    ? { hidden: {}, visible: { transition: { staggerChildren: 0, delayChildren: 0 } } }
    : staggerContainer;
  const itemVariants: Variants = qa ? instantItem : fadeUp;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-[hsla(220,16%,12%,0.08)] bg-[hsl(var(--background))]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
        <div
          className={cn(
            "relative order-2 flex flex-col justify-center px-4 lg:order-1 lg:px-10",
            compact ? "py-10 md:py-12" : "py-10 md:py-14 lg:py-16",
          )}
        >
          <motion.div
            variants={containerVariants}
            initial={motionInitial}
            animate="visible"
            className={cn("max-w-xl lg:max-w-2xl", contentClassName)}
          >
            {eyebrow ? (
              <motion.p
                variants={itemVariants}
                className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[hsl(152_58%_26%)]"
              >
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h1
              variants={itemVariants}
              className="mt-3 text-balance text-[hsl(var(--foreground))]"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-xl text-pretty text-[hsl(var(--muted-foreground))] md:text-[1.02rem]"
            >
              {subtitle}
            </motion.p>

            {(primaryCta || secondaryCta) && (
              <motion.div
                variants={itemVariants}
                className="mt-7 flex flex-wrap gap-3"
              >
                {primaryCta ? (
                  <Button size="lg" className="min-h-11 px-6 font-semibold" asChild>
                    {isExternalHref(primaryCta.href) ? (
                      <a href={primaryCta.href}>{primaryCta.label}</a>
                    ) : (
                      <Link href={primaryCta.href}>{primaryCta.label}</Link>
                    )}
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-h-11 border-[hsla(220,18%,12%,0.18)] bg-white/70 px-6 font-semibold text-[hsl(var(--foreground))] transition-colors duration-200 hover:border-[hsl(var(--primary))]/35 hover:bg-white"
                    asChild
                  >
                    {isExternalHref(secondaryCta.href) ? (
                      <a href={secondaryCta.href}>{secondaryCta.label}</a>
                    ) : (
                      <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                    )}
                  </Button>
                ) : null}
              </motion.div>
            )}

            {infoLine ? (
              <motion.div
                variants={itemVariants}
                className="mt-7 max-w-xl border-t border-[hsla(220,14%,12%,0.1)] pt-5 text-sm text-[hsl(var(--muted-foreground))]"
              >
                {infoLine}
              </motion.div>
            ) : null}
          </motion.div>
        </div>

        {imageSrc ? (
          <div
            className={cn(
              "depth-tilt relative order-1 w-full overflow-hidden bg-[hsl(220_12%_88%)] lg:order-2",
              compact
                ? "min-h-[200px] max-h-[280px] sm:min-h-[240px] sm:max-h-[320px]"
                : "aspect-[16/10] min-h-[220px] max-lg:max-h-[min(48vh,380px)] lg:aspect-auto lg:min-h-[min(52vh,500px)]",
            )}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className={cn("h-full w-full object-cover object-center", imageClassName)}
              sizes="(min-width: 1024px) 48vw, 100vw"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/10 lg:to-black/25"
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
