"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowRight, ArrowsClockwise, Plus, Trash } from "@phosphor-icons/react";
import { useId, useState, type FormEvent } from "react";
import { SITE } from "@/site.config";
import type { AppContent } from "@/lib/content";
import { countByStatus, isItemList, LIMITS, nextStatus, seedItems, validateDraft, type Item, type Status } from "@/lib/board";
import { getDemoStore, useDemoStore } from "@/lib/demo-store";
import { formatTime } from "@/lib/format";
import { useToast } from "../Providers";
import { CountUp, Eyebrow, Reveal, Shell } from "../motion";

const CHIP: Record<Status, string> = { 0: "bg-accent-2/20 text-ink", 1: "bg-accent/15 text-accent", 2: "bg-accent-3/15 text-accent-3" };
const DOT: Record<Status, string> = { 0: "bg-accent-2", 1: "bg-accent", 2: "bg-accent-3" };

/**
 * Example app page: a list of records moving through three statuses, stored in localStorage and synced
 * across tabs. Labels come from the preset (requests, invoices, appointments, bookings...).
 * Replace or extend this with the client's real flow; keep the store + validation pattern.
 */
export function Board({ app, storeKey }: { app: AppContent; storeKey: string }) {
  const store = getDemoStore(`${storeKey}-items`, seedItems(app.seed), isItemList);
  const items = useDemoStore(store);
  const toast = useToast();
  const [filter, setFilter] = useState<Status | "all">("all");
  const counts = countByStatus(items);
  const shown = filter === "all" ? items : items.filter((i) => i.status === filter);

  const advance = (item: Item) => {
    const next = nextStatus(item.status);
    store.set((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
    toast(`${item.title}: ${app.statuses[next]}`);
  };
  const remove = (item: Item) => {
    store.set((prev) => prev.filter((i) => i.id !== item.id));
    toast(`${app.singular} removed`, "info");
  };

  return (
    <div className="px-4 pb-10 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="accent">Live demo</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.045em]">{app.title}</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">{app.intro}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {app.statuses.map((label, s) => (
            <Reveal key={label} delay={s * 0.06}>
              <Shell dark={s === 2} inner="flex items-end justify-between p-6">
                <div>
                  <p className={`flex items-center gap-2 text-sm ${s === 2 ? "text-canvas/70" : "text-ink-soft"}`}>
                    <span className={`h-2 w-2 rounded-full ${DOT[s as Status]}`} />
                    {label}
                  </p>
                  <p className="mt-3 font-display text-5xl font-semibold leading-none tracking-[-0.04em]">
                    <CountUp to={counts[s]} duration={0.8} />
                  </p>
                </div>
                <p className={`text-sm ${s === 2 ? "text-canvas/50" : "text-ink-soft/70"}`}>{items.length ? Math.round((counts[s] / items.length) * 100) : 0}%</p>
              </Shell>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <Shell inner="p-3 md:p-4">
              <LayoutGroup>
                <div role="tablist" aria-label={`Filter ${app.plural.toLowerCase()}`} className="no-scrollbar flex gap-1 overflow-x-auto p-1">
                  {(["all", 0, 1, 2] as const).map((f) => {
                    const active = filter === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setFilter(f)}
                        className={`relative isolate shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-canvas" : "text-ink-soft hover:text-ink"}`}
                      >
                        {active && <motion.span layoutId="board-tab" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                        {f === "all" ? `All ${app.plural.toLowerCase()}` : app.statuses[f]}
                        <span className="ml-2 tabular-nums opacity-60">{f === "all" ? items.length : counts[f]}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>

              <ul className="mt-3 flex flex-col gap-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {shown.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="group flex flex-col gap-3 rounded-[1.4rem] bg-canvas/70 p-4 ring-1 ring-ink/5 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.title}</p>
                        <p className="mt-0.5 truncate text-sm text-ink-soft">
                          {app.metaLabel}: {item.meta}
                          {item.createdAt !== undefined && <span className="text-ink-soft/70"> · added {formatTime(item.createdAt, SITE.locale, SITE.timeZone)}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.span key={item.status} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className={`rounded-full px-3 py-1 text-xs font-medium ${CHIP[item.status]}`}>
                          {app.statuses[item.status]}
                        </motion.span>
                        <button
                          type="button"
                          onClick={() => advance(item)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-canvas transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.04] active:scale-95"
                        >
                          {item.status === 2 ? <ArrowsClockwise size={13} weight="bold" /> : <ArrowRight size={13} weight="bold" />}
                          {item.status === 2 ? "Reopen" : app.statuses[nextStatus(item.status)]}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(item)}
                          aria-label={`Remove ${item.title}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {shown.length === 0 && <li className="rounded-[1.4rem] p-10 text-center text-ink-soft">Nothing here yet.</li>}
              </ul>
            </Shell>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <AddForm app={app} onAdd={(title, meta) => {
              store.set((prev) => [{ id: `item-${Date.now().toString(36)}`, title, meta, status: 0, createdAt: Date.now() }, ...prev]);
              setFilter("all");
              toast(`${app.singular} added`);
            }} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function AddForm({ app, onAdd }: { app: AppContent; onAdd: (title: string, meta: string) => void }) {
  const id = useId();
  const [error, setError] = useState<{ field: "title" | "meta"; text: string } | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = validateDraft(String(data.get("title") ?? ""), String(data.get("meta") ?? ""), { title: app.singular, meta: app.metaLabel });
    if (!res.ok) {
      setError({ field: res.field, text: res.error });
      form.querySelector<HTMLInputElement>(`[name="${res.field}"]`)?.focus();
      return;
    }
    setError(null);
    onAdd(res.title, res.meta);
    form.reset();
  };

  const field = (name: "title" | "meta", label: string, placeholder: string, max: number) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        maxLength={max + 20}
        aria-invalid={error?.field === name}
        aria-describedby={error?.field === name ? `${id}-err` : undefined}
        className="mt-2 w-full rounded-2xl bg-canvas/10 px-4 py-3 text-canvas placeholder:text-canvas/40 ring-1 ring-canvas/15 transition-shadow focus:outline-none focus:ring-2 focus:ring-accent-2 aria-[invalid=true]:ring-accent"
      />
    </label>
  );

  return (
    <Shell dark inner="p-6 md:p-7">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">New {app.singular.toLowerCase()}</p>
          <p className="mt-1 text-sm text-canvas/60">Saved in this browser. Open a second tab to watch it sync.</p>
        </div>
        {field("title", app.singular, app.placeholder.title, LIMITS.title.max)}
        {field("meta", app.metaLabel, app.placeholder.meta, LIMITS.meta.max)}
        <AnimatePresence>
          {error && (
            <motion.p id={`${id}-err`} role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-accent-2">
              {error.text}
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="submit"
          className="group mt-2 flex items-center justify-between rounded-full bg-accent py-2 pl-5 pr-2 font-medium text-canvas transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.02] active:scale-[0.98]"
        >
          Add {app.singular.toLowerCase()}
          <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas/20 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-90">
            <Plus size={16} weight="bold" />
          </span>
        </button>
      </form>
    </Shell>
  );
}
