"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Visual } from "@/lib/content";
import { Media } from "../Media";

const ring = "ring-[6px] ring-card shadow-[0_40px_80px_-30px_rgba(22,21,15,0.6)]";

/**
 * Three visuals (photos or ArtPanels) dealt onto the table like cards (when `play` turns true), then drifting at
 * different speeds on scroll. `badge` sits over the left edge (a SpinBadge works well).
 */
export function ParallaxStack({ visuals, play, badge, className }: { visuals: readonly [Visual, Visual, Visual]; play: boolean; badge?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], [60, -120]);
  const yTop = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yLow = useTransform(scrollYProgress, [0, 1], [120, -220]);
  const rMain = useTransform(scrollYProgress, [0, 1], [-2, -8]);

  const deal = (i: number, rotate: number) => ({
    initial: { opacity: 0, y: 160, rotate: rotate + 14, scale: 0.85 },
    animate: play ? { opacity: 1, y: 0, rotate, scale: 1 } : undefined,
    transition: { type: "spring" as const, stiffness: 90, damping: 16, delay: 0.25 + i * 0.12 },
  });

  const [main, top, low] = visuals;
  return (
    <div ref={ref} className={`relative h-[460px] sm:h-[560px] lg:h-[640px] ${className ?? ""}`}>
      <motion.div style={{ y: yTop }} className="absolute right-0 top-0 h-[42%] w-[48%]">
        <motion.div {...deal(2, 7)} className={`relative h-full w-full overflow-hidden rounded-[1.6rem] ${ring}`}>
          <Media visual={top} sizes="(min-width:1024px) 20vw, 45vw" variant={1} priority />
        </motion.div>
      </motion.div>
      <motion.div style={{ y: yMain, rotate: rMain }} className="absolute left-[4%] top-[14%] h-[62%] w-[70%]">
        <motion.div {...deal(0, 0)} className={`relative h-full w-full overflow-hidden rounded-[2rem] ${ring}`}>
          <Media visual={main} sizes="(min-width:1024px) 30vw, 70vw" variant={0} priority />
        </motion.div>
      </motion.div>
      <motion.div style={{ y: yLow }} className="absolute bottom-0 right-[6%] h-[40%] w-[46%]">
        <motion.div {...deal(1, -6)} className={`relative h-full w-full overflow-hidden rounded-[1.6rem] ${ring}`}>
          <Media visual={low} sizes="(min-width:1024px) 20vw, 45vw" variant={2} />
        </motion.div>
      </motion.div>
      {badge && (
        <motion.div
          className="absolute bottom-[30%] left-0 z-10"
          initial={{ scale: 0, rotate: -90 }}
          animate={play ? { scale: 1, rotate: 0 } : undefined}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.7 }}
        >
          {badge}
        </motion.div>
      )}
    </div>
  );
}
