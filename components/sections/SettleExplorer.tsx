"use client";

import { ArrowUpRight, Check } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CHECKLIST, GUIDES } from "@/lib/pangea";
import { Icon } from "../Icon";
import { Reveal } from "../motion";

/**
 * Settlement guides: a first-weeks checklist (ticks stay in this tab only) and a two-pane guide reader.
 * Each checklist row jumps to its guide. Facts and links come from lib/pangea.ts.
 */
export function SettleExplorer() {
  const [id, setId] = useState(GUIDES[0].id);
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const guide = GUIDES.find((g) => g.id === id) ?? GUIDES[0];
  const toggle = (k: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (!next.delete(k)) next.add(k);
      return next;
    });
  const open = (gid: string) => {
    setId(gid);
    document.getElementById("guide-reader")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-10">
      {/* First weeks checklist */}
      <Reveal className="rounded-[2rem] bg-deep p-6 text-canvas md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-canvas/50">Your first weeks</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Six things to sort out, in order.</h2>
          </div>
          <div className="md:w-72">
            <p className="text-sm text-canvas/70" aria-live="polite">
              <span className="font-display text-2xl font-semibold tabular-nums text-accent-2">{done.size}</span> of {CHECKLIST.length} done
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas/10" role="progressbar" aria-valuemin={0} aria-valuemax={CHECKLIST.length} aria-valuenow={done.size} aria-label="Checklist progress">
              <motion.div className="h-full origin-left rounded-full bg-accent-2" animate={{ scaleX: done.size / CHECKLIST.length }} initial={false} transition={{ type: "spring", stiffness: 200, damping: 26 }} />
            </div>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {CHECKLIST.map((c) => {
            const on = done.has(c.id);
            return (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-canvas/[0.06] p-3 pe-4">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  aria-label={c.label}
                  onClick={() => toggle(c.id)}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 ${on ? "border-accent-2 bg-accent-2 text-deep" : "border-canvas/30 text-transparent hover:border-canvas/60"}`}
                >
                  <Check size={16} weight="bold" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${on ? "text-canvas/50 line-through" : ""}`}>{c.label}</p>
                  <p className="text-xs text-canvas/50">{c.when}</p>
                </div>
                <button type="button" onClick={() => open(c.guide)} className="shrink-0 text-xs font-medium text-accent-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent-2">
                  Guide
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* Guide reader */}
      <div id="guide-reader" className="mt-16 grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-12">
        <div role="tablist" aria-label="Guides" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0">
          {GUIDES.map((g) => {
            const on = g.id === id;
            return (
              <button
                key={g.id}
                role="tab"
                id={`guide-tab-${g.id}`}
                aria-selected={on}
                aria-controls="guide-panel"
                type="button"
                onClick={() => setId(g.id)}
                className={`relative isolate flex shrink-0 items-center gap-3 rounded-2xl p-3 pe-5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full ${on ? "text-canvas" : "bg-ink/[0.04] text-ink hover:bg-ink/[0.07]"}`}
              >
                {on && <motion.span layoutId="guide-pill" className="absolute inset-0 -z-10 rounded-2xl bg-deep" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${on ? "bg-canvas/10 text-accent-2" : "bg-accent/10 text-accent"}`}>
                  <Icon name={g.icon} size={22} weight="duotone" />
                </span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap font-display text-base font-semibold tracking-tight lg:whitespace-normal">{g.title}</span>
                  <span className={`hidden text-xs lg:block ${on ? "text-canvas/60" : "text-ink-soft"}`}>{g.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="guide-panel" role="tabpanel" aria-labelledby={`guide-tab-${id}`} className="lg:col-span-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={guide.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="rounded-[2rem] bg-card p-6 ring-1 ring-ink/5 md:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{guide.tagline}</p>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{guide.title}</h3>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{guide.intro}</p>

              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {guide.facts.map((f) => (
                  <div key={f.label} className="rounded-2xl bg-canvas p-4">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">{f.label}</dt>
                    <dd className="mt-1 font-display text-lg font-semibold leading-tight">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 rounded-2xl border border-accent-2/60 bg-accent-2/15 p-4 text-sm">
                <strong className="font-semibold">{guide.tip.label}: </strong>
                {guide.tip.text}
              </p>

              <h4 className="mt-8 font-display text-lg font-semibold">{guide.list.title}</h4>
              <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
                {guide.list.items.map((it) => (
                  <li key={it.name} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="font-medium sm:w-56 sm:shrink-0">{it.name}</span>
                    <span className="text-sm text-ink-soft">{it.note}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={guide.action.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-deep py-2.5 pe-2 ps-5 text-sm font-medium text-canvas transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03]">
                  {guide.action.label}
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-canvas/15 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight size={14} weight="bold" />
                  </span>
                </a>
                <span className="text-sm text-ink-soft">Also in the app, in 13 languages.</span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
