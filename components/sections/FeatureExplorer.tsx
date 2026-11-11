"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FEATURE_GROUPS } from "@/lib/pangea";
import { Icon } from "../Icon";
import { Eyebrow, Reveal } from "../motion";

/** Five groups, one tab each. Every feature in the group shows with its own icon next to a photo. Lives inside /#work. */
export function FeatureExplorer() {
  const [id, setId] = useState(FEATURE_GROUPS[0].id);
  const group = FEATURE_GROUPS.find((g) => g.id === id) ?? FEATURE_GROUPS[0];
  return (
    <section className="px-4 py-20 md:px-10 md:py-32" aria-labelledby="explorer-title">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="accent">Everything in one app</Eyebrow>
          <h2 id="explorer-title" className="mt-5 font-display text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance">
            One app instead of a dozen Facebook groups.
          </h2>
        </Reveal>

        <div role="tablist" aria-label="Feature groups" className="relative mt-10 flex flex-wrap gap-2">
          {FEATURE_GROUPS.map((g) => {
            const on = g.id === id;
            return (
              <button
                key={g.id}
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={on}
                aria-controls="explorer-panel"
                type="button"
                onClick={() => setId(g.id)}
                className={`relative isolate flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? "text-canvas" : "bg-ink/[0.06] text-ink-soft hover:text-ink"}`}
              >
                {on && <motion.span layoutId="explorer-pill" className="absolute inset-0 -z-10 rounded-full bg-deep" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <Icon name={g.icon} size={18} weight="duotone" />
                {g.label}
                <span className={`text-xs tabular-nums ${on ? "text-canvas/60" : "text-ink-soft/70"}`}>{g.items.length}</span>
              </button>
            );
          })}
        </div>

        <div id="explorer-panel" role="tabpanel" aria-labelledby={`tab-${id}`} className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={group.id + "-img"} className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-ink/5 lg:col-span-5 lg:aspect-auto lg:min-h-[420px]" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <Image src={group.photo} alt={group.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul key={group.id} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7" initial="hide" animate="show" exit="hide" variants={{ show: { transition: { staggerChildren: 0.06 } }, hide: {} }}>
              {group.items.map((f) => (
                <motion.li
                  key={f.title}
                  variants={{ hide: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="flex flex-col gap-4 rounded-[1.5rem] bg-card p-6 ring-1 ring-ink/5"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/10 text-accent">
                    <Icon name={f.icon} size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
