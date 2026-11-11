"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { MOTION } from "@/lib/motion-styles";

/**
 * Words rise out of a mask one after another, in the site's motion style (spring and tilt, quick rise, slanted, bouncy).
 * `accents` maps an exact word (punctuation included) to extra classes, e.g. { "weekend.": "font-serif italic text-accent" }.
 * It is a plain object on purpose: server pages can pass it (functions cannot cross to client components).
 * `play` false = wait for scroll into view; true = play now (gate it with useIntroDone() in a hero).
 */
export function SplitWords({ text, className, delay = 0, play = false, accents }: { text: string; className?: string; delay?: number; play?: boolean; accents?: Record<string, string> }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
        {/* The space sits outside the inline-block: trailing spaces inside one are dropped. */}
        <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={`inline-block ${accents?.[w] ?? ""}`}
            initial={MOTION.words.from}
            animate={play ? MOTION.words.to : undefined}
            whileInView={play ? undefined : MOTION.words.to}
            viewport={{ once: true }}
            transition={{ ...MOTION.words.transition, delay: delay + i * MOTION.words.stagger }}
          >
            {w}
          </motion.span>
        </span>
        {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}

/** Letters rise one by one. Best for short words (logos, big numbers). */
export function SplitChars({ text, className, delay = 0, play = false }: { text: string; className?: string; delay?: number; play?: boolean }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={`${c}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={play ? { y: 0 } : undefined}
            whileInView={play ? undefined : { y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: delay + i * 0.04 }}
          >
            {c === " " ? "\u00a0" : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
