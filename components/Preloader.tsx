"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Visual } from "@/lib/content";
import { INTRO_KEY } from "@/lib/intro";
import { MOTION, type ExitKind } from "@/lib/motion-styles";
import { Media } from "./Media";
import { markIntroDone } from "./Providers";

const CURTAIN = [0.76, 0, 0.24, 1] as const;
type Phase = "load" | "exit" | "gone";

/**
 * Intro, once per tab:
 * 1. Photos stack up inside a frame, the brand name rises letter by letter, a counter runs 000 to 100.
 * 2. Content lifts away, then two layers (deep, then accent) leave in the site's motion style:
 *    curtain columns rising in a wave, one panel wiping up, horizontal blinds folding, or a closing circle.
 * The hero starts animating as the layers begin to move (markIntroDone), so the two overlap.
 */
type Props = {
  name: string;
  /** Italic serif word after the name. Empty string to hide. */
  accent: string;
  kicker: string;
  /** Shown one after another in the frame. Photos or ArtPanel stand-ins (see Visual). */
  visuals: Visual[];
  columns: number;
  minMs: number;
};

export function Preloader({ name, accent, kicker, visuals, columns, minMs }: Props) {
  const frames = Math.max(visuals.length, 1);
  const [phase, setPhase] = useState<Phase>("load");
  const [frame, setFrame] = useState(0);
  const finished = useRef(false);
  const count = useMotionValue(0);
  const counter = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(count, [0, 100], [0, 1]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const root = document.documentElement;
    root.style.overflow = "";
    root.dataset.intro = "done";
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Storage blocked: the intro just plays again on the next load.
    }
    setPhase("gone");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Already played in this tab: globals.css keeps it hidden, nothing to run.
    if (root.dataset.intro === "done") return;
    root.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 250 : minMs;
    const run = animate(count, 100, { duration: total / 1000, ease: [0.65, 0, 0.35, 1] });
    const step = window.setInterval(() => setFrame((f) => Math.min(f + 1, frames - 1)), total / frames);

    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([wait(total), Promise.race([fonts, wait(4000)])]).then(() => {
      if (cancelled) return;
      window.clearInterval(step);
      setPhase("exit");
      markIntroDone();
    });

    return () => {
      cancelled = true;
      run.stop();
      window.clearInterval(step);
    };
  }, [count, frames, minMs]);

  // Safety net: if an animation callback never fires (reduced motion, tab in background), still let go.
  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(finish, 2400);
    return () => window.clearTimeout(t);
  }, [phase, finish]);

  if (phase === "gone") return null;
  const exiting = phase === "exit";
  const chars = Array.from(name);

  return (
    <div className="ct-preloader fixed inset-0 z-[90]" style={{ pointerEvents: exiting ? "none" : "auto" }} aria-hidden>
      {/* Back layer: accent, leaves last and reveals the page. */}
      <ExitLayer kind={MOTION.exit} count={columns} className="bg-accent" exiting={exiting} delay={0.42} onDone={finish} />
      {/* Front layer: deep, leaves first and flashes the accent layer underneath. */}
      <ExitLayer kind={MOTION.exit} count={columns} className="bg-deep" exiting={exiting} delay={0.3} />

      <motion.div
        className="relative flex h-full flex-col justify-between p-5 text-canvas md:p-10"
        animate={exiting ? { opacity: 0, y: -70 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: CURTAIN }}
      >
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.24em] text-canvas/60">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {kicker}
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="tabular-nums">
            {String(frame + 1).padStart(2, "0")} / {String(frames).padStart(2, "0")}
          </motion.span>
        </div>

        {/* Photo frame: each image wipes up over the last one. */}
        <motion.div
          className="absolute left-1/2 top-1/2 aspect-[3/4] w-[min(52vw,250px)] -translate-x-1/2 -translate-y-[58%] overflow-hidden rounded-[1.4rem]"
          initial={{ clipPath: "inset(50% 50% 50% 50% round 22px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }}
          transition={{ duration: 0.9, ease: CURTAIN }}
        >
          {visuals.map((v, i) => (
            <motion.div
              key={`${v.photo ?? v.icon}-${i}`}
              className="absolute inset-0"
              initial={{ clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: i <= frame ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
              transition={{ duration: 0.55, ease: CURTAIN }}
            >
              <motion.div className="absolute inset-0" initial={{ scale: 1.35 }} animate={{ scale: i <= frame ? 1 : 1.35 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <Media visual={{ ...v, alt: "" }} sizes="250px" variant={i} priority />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <div>
          <div className="flex items-end justify-between gap-6">
            <p className="font-display text-[clamp(3.2rem,12vw,11rem)] font-semibold leading-[0.82] tracking-[-0.05em]">
              {chars.map((c, i) => (
                <span key={`${c}-${i}`} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: CURTAIN, delay: 0.15 + i * 0.045 }}>
                    {c === " " ? "\u00a0" : c}
                  </motion.span>
                </span>
              ))}
              {accent && (
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <motion.span
                    className="ml-[0.18em] inline-block font-serif font-normal italic tracking-[-0.02em] text-accent-2"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: CURTAIN, delay: 0.2 + chars.length * 0.045 }}
                  >
                    {accent}
                  </motion.span>
                </span>
              )}
            </p>
            <motion.span className="mb-2 font-display text-[clamp(2rem,5vw,4.5rem)] font-medium leading-none tabular-nums text-canvas/90">{counter}</motion.span>
          </div>
          <div className="mt-6 h-[3px] overflow-hidden rounded-full bg-canvas/10">
            <motion.div className="h-full origin-left bg-accent-2" style={{ scaleX: bar }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

type LayerProps = { kind: ExitKind; count: number; className: string; exiting: boolean; delay: number; onDone?: () => void };

function ExitLayer({ kind, count, className, exiting, delay, onDone }: LayerProps) {
  const done = exiting ? onDone : undefined;
  if (kind === "wipe") {
    return <motion.div className={`absolute inset-0 ${className}`} animate={exiting ? { y: "-102%" } : { y: 0 }} transition={{ duration: 0.75, ease: CURTAIN, delay: exiting ? delay : 0 }} onAnimationComplete={done} />;
  }
  if (kind === "iris") {
    return (
      <motion.div
        className={`absolute inset-0 ${className}`}
        initial={{ clipPath: "circle(150% at 50% 50%)" }}
        animate={{ clipPath: exiting ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)" }}
        transition={{ duration: 0.9, ease: CURTAIN, delay: exiting ? delay : 0 }}
        onAnimationComplete={done}
      />
    );
  }
  // columns: vertical strips rise in a wave. blinds: horizontal strips fold up one after another.
  const rows = kind === "blinds";
  return (
    <div className={`absolute inset-0 flex ${rows ? "flex-col" : ""}`}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          // -mr-px / -mb-px hide hairline gaps between strips on fractional sizes.
          className={`flex-1 ${rows ? "-mb-px w-full origin-top" : "-mr-px h-full"} ${className}`}
          animate={exiting ? (rows ? { scaleY: 0 } : { y: "-102%" }) : rows ? { scaleY: 1 } : { y: 0 }}
          transition={{ duration: rows ? 0.6 : 0.85, ease: CURTAIN, delay: exiting ? delay + i * 0.065 : 0 }}
          onAnimationComplete={i === count - 1 ? done : undefined}
        />
      ))}
    </div>
  );
}
