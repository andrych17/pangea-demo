"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin accent bar across the top that fills as the page scrolls. Already mounted in app/layout.tsx. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden data-noprint className="fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-accent" style={{ scaleX }} />;
}
