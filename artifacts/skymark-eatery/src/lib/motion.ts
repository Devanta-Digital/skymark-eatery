import type { Variants } from "framer-motion";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.35, ease: easeOut } },
};

export const subtleParallax = (distance = 26): Variants => ({
  hidden: { opacity: 0.82, y: 0 },
  visible: {
    opacity: 1,
    y: -distance,
    transition: { duration: 0.7, ease: easeOut },
  },
});
