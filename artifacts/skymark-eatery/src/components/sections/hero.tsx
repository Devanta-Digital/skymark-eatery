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
  /** Interior marketing pages: shorter hero than home — less scroll before content */
  density?: "default" | "compact" | "interior";
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
  const interior = density === "interior";
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

  const editorialHero = className?.includes("home-hero");
  const showDisplayTitle = editorialHero || interior || compact;

  return (
    <section
      className={cn(
        "relative border-b bg-[hsl(var(--background))]",
        interior
          ? "border-[hsla(32,18%,10%,0.07)]"
          : "border-[hsla(220,16%,12%,0.08)]",
        editorialHero ? "overflow-x-clip overflow-y-visible" : "overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col lg:grid lg:items-stretch lg:min-h-0",
          interior && "lg:min-h-[min(52vh,580px)]",
          editorialHero
            ? "lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
            : "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]",
        )}
      >
        <div
          className={cn(
            "relative order-2 flex flex-col justify-center px-4 lg:order-1 lg:px-10",
            compact
              ? "py-10 md:py-12"
              : interior
                ? "py-9 md:py-11 lg:py-12"
                : editorialHero
                  ? "py-9 md:py-12 lg:py-[3.35rem]"
                  : "py-10 md:py-14 lg:py-16",
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
              className={cn(
                "mt-3 text-balance text-[hsl(var(--foreground))]",
                showDisplayTitle && "font-display-hero",
                editorialHero &&
                  "max-w-[17ch] text-[clamp(1.9rem,4.5vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.03em] sm:max-w-[22ch] md:max-w-[26ch] lg:max-w-[30ch]",
                interior &&
                  "max-w-[20ch] text-[clamp(1.55rem,3.2vw,2.35rem)] font-semibold leading-[1.1] tracking-[-0.02em] sm:max-w-[28ch] md:max-w-[32ch]",
                compact &&
                  "max-w-[18ch] text-[clamp(1.45rem,2.8vw,2.1rem)] font-semibold leading-[1.12] tracking-[-0.02em] sm:max-w-[26ch]",
              )}
            >
              {title}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className={cn(
                "mt-4 text-pretty text-[hsl(var(--muted-foreground))] md:text-[1.02rem]",
                editorialHero ? "max-w-md lg:max-w-lg" : "max-w-xl",
              )}
            >
              {subtitle}
            </motion.p>

            {(primaryCta || secondaryCta) && (
              <motion.div
                variants={itemVariants}
                className={cn(
                  "flex flex-wrap",
                  editorialHero ? "mt-8 gap-x-4 gap-y-3" : "mt-7 gap-3",
                )}
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
                className={cn(
                  "max-w-xl border-t border-[hsla(220,14%,12%,0.1)] text-sm text-[hsl(var(--muted-foreground))]",
                  editorialHero ? "mt-9 w-full max-w-md pt-6" : "mt-7 pt-5",
                )}
              >
                {infoLine}
              </motion.div>
            ) : null}
          </motion.div>
        </div>

        {imageSrc ? (
          <div
            className={cn(
              "depth-tilt relative order-1 w-full overflow-hidden lg:order-2",
              compact
                ? "bg-[hsl(220_12%_88%)]"
                : interior
                  ? "bg-[hsl(33_32%_90%)]"
                  : "bg-[hsl(220_12%_88%)]",
              compact
                ? "min-h-[200px] max-h-[280px] sm:min-h-[240px] sm:max-h-[320px]"
                : interior
                  ? "aspect-video min-h-[min(30vh,260px)] max-lg:max-h-[min(44vh,380px)] lg:aspect-auto lg:min-h-full lg:max-h-[min(58vh,620px)] lg:self-stretch lg:-mr-[clamp(0.5rem,3.5vw,2.5rem)] lg:min-w-0 lg:max-w-none"
                  : "aspect-[16/10] min-h-[220px] max-lg:max-h-[min(48vh,380px)] lg:aspect-auto lg:min-h-[min(52vh,500px)]",
              editorialHero &&
                "lg:-mr-[clamp(0.75rem,4vw,2.75rem)] lg:min-w-0 lg:max-w-none lg:self-stretch",
            )}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className={cn(
                "h-full w-full object-cover object-center",
                (editorialHero || interior) && "hero-photo-editorial",
                compact && className?.includes("contact-hero") && "hero-photo-editorial",
                imageClassName,
              )}
              sizes="(min-width: 1024px) 48vw, 100vw"
              decoding="async"
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0",
                interior
                  ? "bg-gradient-to-t from-black/25 via-black/[0.04] to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/10 lg:to-black/18"
                  : "hero-image-vignette bg-gradient-to-t from-black/35 via-black/5 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/12 lg:to-black/28",
                editorialHero && !interior && "lg:via-black/16 lg:to-black/34",
                className?.includes("contact-hero") &&
                  "lg:via-black/10 lg:to-black/22",
              )}
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
