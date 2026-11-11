"use client";

import { Check } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal } from "../motion";
import { PLAY_URL } from "@/lib/i18n";

export type Plan = { name: string; for: string; monthly: number | null; yearly?: number; points: string[]; featured?: boolean };

/** Membership tiers with a monthly / yearly switch. Plans without a yearly price stay monthly. */
export function Pricing({ plans }: { plans: Plan[] }) {
  const [yearly, setYearly] = useState(false);
  return (
    <>
      <div role="group" aria-label="Billing period" className="relative isolate mx-auto mt-10 flex w-fit rounded-full bg-ink/[0.06] p-1 text-sm font-medium">
        {(["Monthly", "Yearly"] as const).map((label) => {
          const on = (label === "Yearly") === yearly;
          return (
            <button key={label} type="button" aria-pressed={on} onClick={() => setYearly(label === "Yearly")} className={`relative rounded-full px-5 py-2 transition-colors ${on ? "text-canvas" : "text-ink-soft hover:text-ink"}`}>
              {on && <motion.span layoutId="bill-pill" className="absolute inset-0 -z-10 rounded-full bg-deep" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              {label}
            </button>
          );
        })}
      </div>

      <ul className="mx-auto mt-14 grid max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {plans.map((p, i) => {
          const useYear = yearly && p.yearly !== undefined;
          const price = p.monthly === null ? "Free" : `$${useYear ? p.yearly : p.monthly}`;
          const unit = p.monthly === null ? "always" : useYear ? "per year" : "per month";
          return (
            <Reveal as="li" key={p.name} delay={i * 0.07} className={`flex flex-col rounded-[2rem] p-7 ${p.featured ? "bg-deep text-canvas shadow-[0_40px_80px_-40px_rgba(30,58,95,0.9)] lg:-translate-y-4" : "bg-card ring-1 ring-ink/5"}`}>
              {p.featured && <span className="mb-4 w-fit rounded-full bg-accent-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-deep">Most chosen</span>}
              <h3 className="font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.featured ? "text-canvas/65" : "text-ink-soft"}`}>{p.for}</p>
              <div className="mt-7 flex h-14 items-baseline gap-2 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={price} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className="font-display text-5xl font-semibold tracking-tight tabular-nums">
                    {price}
                  </motion.span>
                </AnimatePresence>
                <span className={`text-sm ${p.featured ? "text-canvas/60" : "text-ink-soft"}`}>{unit}</span>
              </div>
              {yearly && p.monthly !== null && p.yearly === undefined && <p className="text-xs text-ink-soft">Billed monthly only</p>}
              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5">
                    <Check size={16} weight="bold" className={`mt-0.5 shrink-0 ${p.featured ? "text-accent-2" : "text-accent"}`} />
                    {pt}
                  </li>
                ))}
              </ul>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03] ${p.featured ? "bg-accent-2 text-deep" : "bg-ink/[0.06] text-ink hover:bg-ink/10"}`}>
                {p.monthly === null ? "Join free" : "Choose " + p.name}
              </a>
            </Reveal>
          );
        })}
      </ul>
    </>
  );
}
