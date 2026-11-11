"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { HomeContent } from "@/lib/content";
import { useIntroDone } from "../Providers";
import { ArrowLink, CountUp, Magnetic, SplitWords } from "../motion";
import { useLang } from "../lang";
import { PhoneStack } from "./PhoneStack";

const ACCENT = "font-serif font-normal italic tracking-[-0.02em] text-accent";

/**
 * Split hero: headline words rise as the preloader curtains lift, three visuals are dealt onto the right
 * like cards and drift at different speeds on scroll, a badge spins faster when you scroll.
 */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  const ready = useIntroDone();
  const lang = useLang();
  const isEn = lang.code === "en";
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const accents = Object.fromEntries(hero.accentWords.map((w) => [w, ACCENT]));
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { delay, type: "spring" as const, stiffness: 120, damping: 20 },
  });

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <motion.div className="lg:col-span-7" style={{ opacity: fade }}>
          <motion.p {...rise(0.1)} className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-ink/[0.05] py-1.5 pl-2 pr-4 text-sm text-ink-soft ring-1 ring-ink/5">
            <span className="relative grid h-2.5 w-2.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            {hero.eyebrow}
          </motion.p>

          <h1 id="hero-title" className="font-display text-[clamp(3rem,7.6vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-balance">
            {/* key remounts the words so a language change replays the rise */}
            <SplitWords key={lang.code} text={isEn ? hero.title : lang.title} play={ready} delay={0.05} accents={isEn ? accents : {}} />
          </h1>

          <motion.p key={lang.code} {...rise(isEn ? 0.6 : 0.15)} className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
            {isEn ? hero.body : lang.body}
          </motion.p>

          <motion.div {...rise(0.75)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Magnetic>
              <ArrowLink href={hero.primary.href} tone="accent">{hero.primary.label}</ArrowLink>
            </Magnetic>
            <Link href={hero.secondary.href} className="group relative text-[15px] font-medium">
              {hero.secondary.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-x-50" />
            </Link>
          </motion.div>

          <motion.dl {...rise(0.95)} className="mt-14 grid max-w-xl grid-cols-3 gap-6">
            {hero.stats.map((s) => (
              <div key={s.label} className="border-l border-ink/10 pl-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {ready ? <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} /> : <span className="tabular-nums">{s.prefix}0{s.suffix}</span>}
                </dd>
                <dd aria-hidden className="mt-1 text-xs leading-snug text-ink-soft md:text-sm">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <PhoneStack className="lg:col-span-5" visuals={hero.visuals} play={ready} />
      </div>
    </section>
  );
}
