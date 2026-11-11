"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { MOTION } from "@/lib/motion-styles";

/**
 * Brings a block in once when it scrolls into view, in the site's motion style (lib/motion-styles.ts):
 * lift and un-blur, quick rise, mask wipe or bouncy scale. Stagger siblings with `delay={i * 0.08}`.
 * `y` overrides the style's travel distance. Reduced motion gets a plain fade.
 */
export function Reveal({ children, delay = 0, y, className, as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "section" | "li" | "article" }) {
  const M = motion[as];
  const reduce = useReducedMotion();
  const { from, to, transition } = MOTION.reveal;
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : y === undefined ? from : { ...from, y }}
      whileInView={reduce ? { opacity: 1 } : to}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ ...transition, delay }}
    >
      {children}
    </M>
  );
}
