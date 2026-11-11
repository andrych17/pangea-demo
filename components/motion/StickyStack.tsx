"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Children, useRef, type ReactNode } from "react";

/**
 * Cards pin one on top of the other while scrolling; the ones underneath shrink and dim a little.
 * Good for "how it works" steps or case studies. Each child becomes one card.
 */
export function StickyStack({ children, top = 110, className }: { children: ReactNode; top?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const items = Children.toArray(children);
  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <Card key={i} i={i} n={items.length} top={top} progress={scrollYProgress}>
          {child}
        </Card>
      ))}
    </div>
  );
}

function Card({ i, n, top, progress, children }: { i: number; n: number; top: number; progress: MotionValue<number>; children: ReactNode }) {
  const target = 1 - (n - 1 - i) * 0.05;
  const scale = useTransform(progress, [i / n, 1], [1, target]);
  const dim = useTransform(progress, [i / n, 1], [0, (n - 1 - i) * 0.12]);
  return (
    <div className="sticky flex h-[78vh] items-start justify-center" style={{ top: top + i * 22 }}>
      <motion.div style={{ scale }} className="relative h-full max-h-[560px] w-full origin-top overflow-hidden rounded-[2rem]">
        {children}
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-ink" />
      </motion.div>
    </div>
  );
}
