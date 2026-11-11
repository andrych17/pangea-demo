"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { SITE } from "@/site.config";

const formats = new Map<number, Intl.NumberFormat>();
function format(n: number, decimals: number) {
  let f = formats.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat(SITE.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    formats.set(decimals, f);
  }
  return f.format(n);
}

/** Counts from 0 to `to` (keeps its decimals: 4.9 stays 4.9) the first time it scrolls into view. Server and first client render both show 0, so no hydration mismatch. */
export function CountUp({ to, prefix = "", suffix = "", duration = 1.6, className }: { to: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const decimals = (String(to).split(".")[1] ?? "").length;
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${prefix}${format(v, decimals)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const run = animate(value, to, { duration: reduce ? 0 : duration, ease: [0.16, 1, 0.3, 1] });
    return () => run.stop();
  }, [inView, to, duration, reduce, value]);

  return (
    <span className={className}>
      <span className="sr-only">{`${prefix}${format(to, decimals)}${suffix}`}</span>
      <motion.span ref={ref} aria-hidden className="tabular-nums">
        {text}
      </motion.span>
    </span>
  );
}
