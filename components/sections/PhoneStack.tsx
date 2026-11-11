"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Visual } from "@/lib/content";

const frame = "aspect-[917/2048] overflow-hidden rounded-[2.2rem] bg-deep p-[7px] shadow-[0_50px_90px_-35px_rgba(30,58,95,0.65)] ring-1 ring-deep/20";

/** Three real app screenshots in phone frames: dealt in like cards, then drifting apart on scroll. */
export function PhoneStack({ visuals, play, className }: { visuals: readonly [Visual, Visual, Visual]; play: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const yFront = useTransform(scrollYProgress, [0, 1], [40, -160]);
  const yRight = useTransform(scrollYProgress, [0, 1], [120, -40]);

  const deal = (i: number, rotate: number) => ({
    initial: { opacity: 0, y: 180, rotate: rotate + 12, scale: 0.85 },
    animate: play ? { opacity: 1, y: 0, rotate, scale: 1 } : undefined,
    transition: { type: "spring" as const, stiffness: 80, damping: 16, delay: 0.2 + i * 0.14 },
  });

  const [front, back, right] = visuals;
  const shot = (v: Visual, priority?: boolean) => (
    <div className="relative h-full w-full overflow-hidden rounded-[calc(2.2rem-7px)]">
      <Image src={v.photo ?? ""} alt={v.alt} fill sizes="(min-width:1024px) 260px, 45vw" priority={priority} className="object-cover object-top" />
    </div>
  );

  return (
    <div ref={ref} className={`relative h-[520px] sm:h-[600px] lg:h-[660px] ${className ?? ""}`}>
      <div aria-hidden className="absolute inset-x-[8%] top-[18%] h-[64%] rounded-full bg-accent-3/25 blur-3xl" />
      <motion.div style={{ y: yBack }} className="absolute left-[2%] top-[6%] w-[40%]">
        <motion.div {...deal(1, -8)} className={`${frame} relative w-full`}>{shot(back)}</motion.div>
      </motion.div>
      <motion.div style={{ y: yRight }} className="absolute right-[2%] top-[14%] w-[40%]">
        <motion.div {...deal(2, 7)} className={`${frame} relative w-full`}>{shot(right)}</motion.div>
      </motion.div>
      <motion.div style={{ y: yFront }} className="absolute left-[29%] top-[10%] z-10 w-[44%]">
        <motion.div {...deal(0, 0)} className={`${frame} relative w-full`}>{shot(front, true)}</motion.div>
      </motion.div>
    </div>
  );
}
