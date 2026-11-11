"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * A statement paragraph whose words light up one by one as it scrolls through the viewport.
 * `accents` works like SplitWords: exact word to extra classes.
 */
export function TextScrub({ text, className, accents }: { text: string; className?: string; accents?: Record<string, string> }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} className={accents?.[w]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, className }: { children: string; progress: MotionValue<number>; range: [number, number]; className?: string }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span aria-hidden className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }} className={className}>
        {children}
      </motion.span>
    </span>
  );
}
