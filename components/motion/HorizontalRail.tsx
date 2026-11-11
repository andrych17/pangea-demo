"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Desktop: the section pins and vertical scroll drives the row sideways, exactly as far as it is wide.
 * Mobile (< md): a native swipe row with snap. `children` are the cards (give them shrink-0 and a width).
 */
export function HorizontalRail({ intro, children, label, className }: { intro?: ReactNode; children: ReactNode; label: string; className?: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(() => -smooth.get() * distance.get());

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => distance.set(Math.max(0, el.scrollWidth - window.innerWidth + 40)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [distance]);

  return (
    <div className={className}>
      <section ref={section} className="relative hidden h-[300vh] md:block" aria-label={label}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-6 pl-10 pr-10">
            {intro && <div className="w-[420px] shrink-0 pr-6">{intro}</div>}
            {children}
          </motion.div>
          <div className="mx-10 mt-10 h-1 overflow-hidden rounded-full bg-ink/10">
            <motion.div style={{ scaleX: smooth }} className="h-full origin-left bg-accent" />
          </div>
        </div>
      </section>

      <section className="py-20 md:hidden" aria-label={label}>
        {intro && <div className="px-4">{intro}</div>}
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 [&>*]:snap-start">{children}</div>
      </section>
    </div>
  );
}
