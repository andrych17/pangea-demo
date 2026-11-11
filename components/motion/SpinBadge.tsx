"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useVelocity } from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";

const FONT = 15.5; // user units, matches text-[15.5px] below
const RING = 2 * Math.PI * 74; // length of the circle the text runs on

/** Round sticker with text running around the edge. Spins slowly, faster while the page scrolls. */
export function SpinBadge({ text, children, className }: { text: string; children?: ReactNode; className?: string }) {
  const id = useId();
  // Chromium drops the letter spacing after the last character, which pinches the seam. A trailing
  // zero-width space makes the real last space get its spacing too.
  const ring = `${text}\u200B`;
  const style = useRef<SVGGElement>(null);
  const measure = useRef<SVGTextElement>(null);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 60, damping: 20 });
  const rotate = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    const boost = Math.min(Math.abs(velocity.get()) / 40, 30);
    rotate.set((rotate.get() + (delta / 1000) * (14 + boost * 8)) % 360);
  });

  // Make the text fill the ring exactly so it loops cleanly: shrink the font when it is too long
  // (it would overlap its own start), then let letter spacing take up the rest (otherwise a gap is left).
  // The length comes from a hidden copy that is not on the path: on the path Firefox piles the overflow
  // onto the end point and reports the ring length. Firefox also ignores textLength on <textPath>.
  // geometricPrecision keeps glyph widths independent of the on-screen size (the hero scales in).
  useEffect(() => {
    const group = style.current;
    const copy = measure.current;
    if (!group || !copy) return;
    const fit = () => {
      group.style.fontSize = "";
      group.style.letterSpacing = "";
      let length = copy.getComputedTextLength();
      if (!length) return;
      if (length > RING) {
        group.style.fontSize = `${(FONT * RING) / length}px`;
        length = copy.getComputedTextLength();
      }
      group.style.letterSpacing = `calc(0.18em + ${(RING - length) / copy.getNumberOfChars()}px)`;
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [text]);

  return (
    <div className={`relative grid h-32 w-32 place-items-center rounded-full bg-accent-2 text-ink shadow-[0_20px_40px_-18px_rgba(22,21,15,0.6)] md:h-40 md:w-40 ${className ?? ""}`}>
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ rotate }} aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <g ref={style} className="fill-ink text-[15.5px] font-semibold tracking-[0.18em] whitespace-pre [text-rendering:geometricPrecision]">
          <text ref={measure} data-badge-measure visibility="hidden">
            {ring}
          </text>
          <text data-badge>
            <textPath href={`#${id}`}>{ring}</textPath>
          </text>
        </g>
      </motion.svg>
      {children}
    </div>
  );
}
