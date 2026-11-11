"use client";

import { motion } from "motion/react";
import { LANGS } from "@/lib/i18n";
import { setLang, useLang } from "../lang";
import { Reveal } from "../motion";

/** "Available in 13 languages": every chip switches the hero, Arabic, Farsi and Dari flip the page to RTL. */
export function Languages() {
  const lang = useLang();
  return (
    <section aria-labelledby="langs-title" className="relative bg-deep px-4 py-14 text-canvas md:px-10 md:py-16">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
        <Reveal className="shrink-0">
          <h2 id="langs-title" className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Available in <span className="font-serif font-normal italic text-accent-2">13 languages</span>
          </h2>
          <p className="mt-2 text-sm text-canvas/60">Tap one. The page switches, right-to-left included.</p>
        </Reveal>
        <ul className="flex flex-wrap gap-2">
          {LANGS.map((l, i) => {
            const active = l.code === lang.code;
            return (
              <motion.li
                key={l.code}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.035 }}
              >
                <button
                  type="button"
                  lang={l.code}
                  onClick={() => {
                    setLang(l.code);
                    document.getElementById("hero-title")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  aria-pressed={active}
                  aria-label={`${l.english}${l.rtl ? ", right to left" : ""}`}
                  className={`relative isolate rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 ${
                    active ? "text-deep" : "text-canvas/85 ring-1 ring-canvas/15 hover:bg-canvas/10 hover:text-canvas"
                  }`}
                >
                  {active && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-accent-2" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                  {l.name}
                  {l.rtl && <span className="ms-1.5 text-[10px] uppercase tracking-wider opacity-60">rtl</span>}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
