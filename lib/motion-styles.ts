/**
 * Motion styles: one setting that changes how the whole demo moves, so two demos for different sectors
 * do not feel like the same template. Each style sets the scroll reveal (Reveal), the page transition
 * (app/template.tsx), the headline words (SplitWords) and the preloader exit (Preloader).
 * Pick with SITE.motion, or leave it out for the sector default below. Tested in motion-styles.test.ts.
 */
import type { TargetAndTransition, Transition } from "motion/react";
import { SITE, type MotionStyle, type Sector } from "../site.config.ts";

type Enter = { from: TargetAndTransition; to: TargetAndTransition; transition: Transition };
export type ExitKind = "columns" | "wipe" | "blinds" | "iris";
export type MotionSpec = {
  /** Blocks entering the viewport. */
  reveal: Enter;
  /** Every page change. */
  page: Enter;
  /** Each headline word inside its mask; `stagger` is seconds between words. */
  words: Enter & { stagger: number };
  /** How the preloader leaves: vertical curtain columns, one panel wiping up, horizontal blinds, or a closing circle. */
  exit: ExitKind;
};

const EXPO = [0.16, 1, 0.3, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;
const QUICK = [0.2, 0.8, 0.2, 1] as const;

export const STYLES: Record<MotionStyle, MotionSpec> = {
  // Calm and premium: soft springs, lift and un-blur.
  silk: {
    reveal: { from: { opacity: 0, y: 36, filter: "blur(8px)" }, to: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { type: "spring", stiffness: 120, damping: 22, mass: 0.9 } },
    page: { from: { opacity: 0, y: 28, filter: "blur(6px)" }, to: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { type: "spring", stiffness: 140, damping: 24 } },
    words: { from: { y: "110%", rotate: 6 }, to: { y: 0, rotate: 0 }, transition: { type: "spring", stiffness: 140, damping: 20 }, stagger: 0.06 },
    exit: "columns",
  },
  // Fast and precise: short distances, quick tweens, sideways page change.
  snap: {
    reveal: { from: { opacity: 0, y: 14 }, to: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: QUICK } },
    page: { from: { opacity: 0, x: 48 }, to: { opacity: 1, x: 0 }, transition: { duration: 0.4, ease: QUICK } },
    words: { from: { y: "105%" }, to: { y: 0 }, transition: { duration: 0.5, ease: EXPO }, stagger: 0.03 },
    exit: "wipe",
  },
  // Magazine: blocks open like a mask from the bottom, long eases, slanted headline words.
  editorial: {
    reveal: {
      from: { opacity: 0, y: 24, clipPath: "inset(100% 0% 0% 0%)" },
      // clip-path is removed afterwards so shadows and rails are never cut off.
      to: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", transitionEnd: { clipPath: "none" } },
      transition: { duration: 1, ease: CURTAIN },
    },
    page: { from: { opacity: 0, y: 64 }, to: { opacity: 1, y: 0 }, transition: { duration: 1.1, ease: EXPO } },
    words: { from: { y: "115%", skewY: 4 }, to: { y: 0, skewY: 0 }, transition: { duration: 1, ease: CURTAIN }, stagger: 0.08 },
    exit: "blinds",
  },
  // Playful: scale and bouncy springs.
  pop: {
    reveal: { from: { opacity: 0, scale: 0.9, y: 24 }, to: { opacity: 1, scale: 1, y: 0 }, transition: { type: "spring", stiffness: 260, damping: 15 } },
    page: { from: { opacity: 0, scale: 0.96 }, to: { opacity: 1, scale: 1 }, transition: { type: "spring", stiffness: 220, damping: 18 } },
    words: { from: { y: "110%", rotate: -8, scale: 0.8 }, to: { y: 0, rotate: 0, scale: 1 }, transition: { type: "spring", stiffness: 300, damping: 14 }, stagger: 0.05 },
    exit: "iris",
  },
};

/** Default style per sector, spread so neighbouring sectors move differently. */
export const SECTOR_MOTION: Record<Sector, MotionStyle> = {
  creative: "editorial",
  saas: "snap",
  health: "silk",
  food: "pop",
  property: "editorial",
  retail: "snap",
  education: "pop",
  events: "pop",
  professional: "silk",
  logistics: "snap",
};

export const MOTION_STYLE: MotionStyle = SITE.motion ?? SECTOR_MOTION[SITE.sector];
export const MOTION: MotionSpec = STYLES[MOTION_STYLE];
