"use client";

import { MagnifyingGlass, SealCheck } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { LANGS } from "@/lib/i18n";
import { PROVIDERS, SERVICE_CATEGORIES } from "@/lib/pangea";
import { Icon } from "../Icon";

const langName = (code: string) => LANGS.find((l) => l.code === code);

/** Filter by profession, language and free text. All sample data, filtered in the browser. */
export function ServiceDirectory() {
  const [cat, setCat] = useState<string>("All");
  const [lang, setLang] = useState("");
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PROVIDERS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!lang || p.langs.includes(lang)) &&
        (!needle || `${p.name} ${p.role} ${p.city} ${p.blurb}`.toLowerCase().includes(needle)),
    );
  }, [cat, lang, q]);

  const reset = () => {
    setCat("All");
    setLang("");
    setQ("");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Profession" className="flex flex-wrap gap-2">
          {["All", ...SERVICE_CATEGORIES].map((c) => {
            const on = c === cat;
            return (
              <button key={c} type="button" aria-pressed={on} onClick={() => setCat(c)} className={`relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? "text-canvas" : "bg-ink/[0.06] text-ink-soft hover:text-ink"}`}>
                {on && <motion.span layoutId="svc-pill" className="absolute inset-0 -z-10 rounded-full bg-deep" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                {c}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative sm:w-64">
            <span className="sr-only">Search name, city or service</span>
            <MagnifyingGlass size={16} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Search name or city" className="h-11 w-full rounded-full bg-ink/[0.06] pe-4 ps-10 text-sm outline-none placeholder:text-ink-soft/70 focus-visible:ring-2 focus-visible:ring-accent" />
          </label>
          <label className="sm:w-56">
            <span className="sr-only">Language</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="h-11 w-full cursor-pointer rounded-full bg-ink/[0.06] px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <option value="">Any language</option>
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.english})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">
        {results.length} {results.length === 1 ? "provider" : "providers"}
      </p>

      <motion.ul layout className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((p) => (
            <motion.li key={p.name} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="flex flex-col rounded-[1.75rem] bg-card p-6 ring-1 ring-ink/5">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <Icon name={p.icon} size={26} weight="duotone" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">{p.name}</h3>
                  <p className="text-sm text-ink-soft">
                    {p.role} · {p.city}
                  </p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Languages">
                {p.langs.map((c) => {
                  const l = langName(c);
                  return (
                    <li key={c} lang={c} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                      {l?.name ?? c}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-ink-soft">
                <span>{p.years} years of practice</span>
                {p.verified ? (
                  <span className="inline-flex items-center gap-1 font-medium text-accent">
                    <SealCheck size={16} weight="fill" /> Verified
                  </span>
                ) : (
                  <span>Verification pending</span>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {results.length === 0 && (
        <div className="mt-8 rounded-[2rem] bg-card p-10 text-center ring-1 ring-ink/5">
          <p className="font-display text-2xl font-semibold">No one matches yet.</p>
          <p className="mt-2 text-ink-soft">Try another language or profession. New providers join every month.</p>
          <button type="button" onClick={reset} className="mt-5 rounded-full bg-deep px-6 py-2.5 text-sm font-medium text-canvas">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
