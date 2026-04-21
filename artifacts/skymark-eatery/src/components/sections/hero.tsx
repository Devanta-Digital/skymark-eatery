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
  return href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
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
    <section className={cn("grain-hero relative overflow-hidden section-dark", className)}>
      {imageSrc ? (
        <div className="absolute inset-0">
          <div className="image-wrapper h-full w-full">
            <img src={imageSrc} alt={imageAlt} className="ratio-hero min-h-[440px] w-full" />
          </div>
          <div
            className={cn(
              "absolute inset-0 bg-[linear-gradient(105deg,rgba(8,6,5,0.94)_0%,rgba(18,12,10,0.8)_48%,rgba(18,12,10,0.5)_100%)]",
              overlayClassName,
            )}
          />
        </div>
      ) : null}

      <div className="relative container mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={cn("max-w-3xl", contentClassName)}
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
          <motion.p variants={fadeUp} className="mt-5 text-measure text-[#d9c7b8]">
            {subtitle}
          </motion.p>

          {(primaryCta || secondaryCta) && (
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {primaryCta ? (
                <Button size="lg" className="px-7" asChild>
                  {isExternalHref(primaryCta.href) ? (
                    <a href={primaryCta.href}>{primaryCta.label}</a>
                  ) : (
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  )}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button size="lg" variant="outline" className="border-white/28 bg-transparent px-6 text-[#f4ebe3] hover:bg-white/10" asChild>
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
            <motion.div variants={fadeUp} className="mt-8 border-t border-white/15 pt-5 text-sm text-[#d3c1b4]">
              {infoLine}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
