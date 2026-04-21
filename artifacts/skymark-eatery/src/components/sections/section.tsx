import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

type SectionTone = "light" | "muted" | "dark" | "transparent";
type SectionDensity = "default" | "airy";

type SectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
  tone?: SectionTone;
  withMotion?: boolean;
  density?: SectionDensity;
};

const sectionToneClass: Record<SectionTone, string> = {
  light: "section-light",
  muted: "section-muted",
  dark: "section-dark",
  transparent: "",
};

const densityClass: Record<SectionDensity, string> = {
  default: "py-16 md:py-24",
  airy: "py-20 md:py-28 lg:py-32",
};

export function Section({
  id,
  className,
  containerClassName,
  contentClassName,
  children,
  tone = "transparent",
  withMotion = false,
  density = "default",
}: SectionProps) {
  const content = withMotion ? (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className={cn("w-full", contentClassName)}
    >
      {children}
    </motion.div>
  ) : (
    <div className={cn("w-full", contentClassName)}>{children}</div>
  );

  return (
    <section
      id={id}
      className={cn(
        densityClass[density],
        sectionToneClass[tone],
        className,
        id ? "anchor-section" : "",
      )}
    >
      <div className={cn("container mx-auto max-w-7xl px-4", containerClassName)}>
        {content}
      </div>
    </section>
  );
}
