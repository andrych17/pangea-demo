"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Visual } from "@/lib/content";
import { Media } from "../Media";

/**
 * Full-bleed visual (photo or ArtPanel) that opens from a small rounded window to full width as it scrolls in,
 * with the image settling from a zoom and the overlay content rising last. Use it for the closing CTA.
 */
export function ClipReveal({ visual, children, className }: { visual: Visual; children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 32]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const textY = useTransform(scrollYProgress, [0.4, 1], [80, 0]);
  const textO = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  return (
    <section ref={ref} className={`px-3 md:px-6 ${className ?? ""}`}>
      <motion.div style={{ clipPath }} className="relative mx-auto h-[86vh] min-h-[560px] max-w-[1600px] overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Media visual={visual} sizes="100vw" variant={0} bare />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
        <motion.div style={{ y: textY, opacity: textO }} className="absolute inset-0 flex flex-col items-start justify-end p-8 text-canvas md:p-16">
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
