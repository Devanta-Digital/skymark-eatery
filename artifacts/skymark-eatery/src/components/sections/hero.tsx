import type { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
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
  overlayClassName?: string;
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
  overlayClassName,
}: HeroProps) {
  return (
    <section
      className={cn(
        "grain-hero section-dark relative min-h-[min(88vh,760px)] overflow-hidden lg:min-h-[min(86vh,820px)]",
        className,
      )}
    >
      {imageSrc ? (
        <>
          <div className="absolute inset-0 lg:hidden">
            <div className="image-wrapper h-full w-full">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="min-h-[min(72vh,560px)] w-full object-cover"
              />
            </div>
            <div
              className={cn(
                "absolute inset-0 bg-[linear-gradient(105deg,rgba(8,6,5,0.94)_0%,rgba(18,12,10,0.82)_48%,rgba(18,12,10,0.55)_100%)]",
                overlayClassName,
              )}
            />
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[min(46%,520px)] lg:block">
            <div className="image-wrapper image-vignette h-full min-h-full">
              <img
                src={imageSrc}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className={cn(
                "absolute inset-0 bg-[linear-gradient(100deg,rgba(8,6,5,0.05)_0%,rgba(18,12,10,0.55)_45%,rgba(18,12,10,0.88)_100%)]",
                overlayClassName,
              )}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(12,9,8,0.92)_0%,rgba(12,9,8,0.55)_52%,transparent_100%)] lg:block" />
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 py-16 md:py-24 lg:min-h-[min(86vh,820px)] lg:justify-end lg:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={cn("lg:col-span-7", contentClassName)}
          >
            {eyebrow ? (
              <motion.p
                variants={fadeUp}
                className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#e2b69a]"
              >
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h1 variants={fadeUp} className="mt-4 text-[#f4ebe3]">
              {title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-[#d9c7b8] lg:max-w-none"
            >
              {subtitle}
            </motion.p>

            {(primaryCta || secondaryCta) && (
              <motion.div
                variants={fadeUp}
                className="mt-8 flex max-w-xl flex-wrap gap-3"
              >
                {primaryCta ? (
                  <Button size="lg" className="min-h-11 px-7" asChild>
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
                    className="min-h-11 border-white/28 bg-transparent px-6 text-[#f4ebe3] hover:bg-white/10"
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
                variants={fadeUp}
                className="mt-8 max-w-xl border-t border-white/15 pt-5 text-sm text-[#d3c1b4]"
              >
                {infoLine}
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
