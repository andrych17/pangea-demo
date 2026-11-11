"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { Asterisk } from "@phosphor-icons/react";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * A band that drifts on its own, speeds up with scroll and flips direction when the user scrolls up.
 * Tilt it with a wrapper: <div className="-rotate-2 bg-accent ..."><VelocityMarquee items={[...]} /></div>.
 */
export function VelocityMarquee({ items, base = 2.5, reverse = false, className }: { items: readonly string[]; base?: number; reverse?: boolean; className?: string }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);
  const xp = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const f = factor.get();
    const sign = reverse ? -1 : 1;
    if (f < 0) dir.current = -sign;
    else if (f > 0) dir.current = sign;
    x.set(x.get() - dir.current * base * (delta / 1000) * (1 + Math.abs(f)));
  });

  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`} aria-hidden>
      <motion.div className="inline-flex w-max items-center" style={{ x: xp }}>
        {[0, 1].map((k) => (
          <div key={k} className="inline-flex items-center">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="inline-flex items-center gap-8 px-8">
                <span>{t}</span>
                <Asterisk size={28} weight="bold" className="opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
