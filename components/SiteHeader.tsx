"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, List, Translate, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { LinkItem } from "@/lib/content";
import { Logo } from "./Logo";
import { LANGS } from "@/lib/i18n";
import { setLang, useLang } from "./lang";

/**
 * Floating pill header: transparent at the top, frosted once you scroll, hides on scroll down and
 * returns on scroll up. Active route gets a sliding pill (layoutId). Mobile menu opens as a circle
 * growing from the burger button.
 */
export function SiteHeader({ name, accent, nav, cta }: { name: string; accent: string; nav: LinkItem[]; cta: LinkItem }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lang = useLang();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (y > 320 && y > prev + 4) setHidden(true);
    else if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hash links (/#work) are sections, never "active"; routes match themselves and their children.
  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <motion.header
        data-noprint
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
        animate={{ y: hidden && !open ? "-120%" : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 40 }}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2 transition-[background-color,box-shadow] duration-500 ease-[var(--ease-spring)] ${
            scrolled ? "bg-card/80 shadow-[0_12px_40px_-24px_rgba(22,21,15,0.45)] ring-1 ring-ink/5 backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          <Link href="/" aria-label={`${name} home`}>
            <Logo name={name} accent={accent} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="relative isolate rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
                {isActive(n.href) && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-ink/[0.07]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">Language</span>
              <Translate size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <select
                value={lang.code}
                onChange={(e) => setLang(e.target.value)}
                className="h-11 max-w-[9.5rem] cursor-pointer appearance-none truncate rounded-full bg-ink/[0.06] pe-4 ps-9 text-sm font-medium text-ink outline-none transition-colors hover:bg-ink/10 focus-visible:ring-2 focus-visible:ring-accent"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <Link
              href={cta.href}
              className="group hidden items-center gap-2 rounded-full bg-ink py-2 pl-4 pr-1.5 text-sm font-medium text-canvas transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03] active:scale-[0.98] sm:flex"
            >
              {cta.label}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-canvas/15 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45">
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full bg-ink/[0.06] lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col bg-deep px-6 pb-10 pt-6 text-canvas lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <Logo name={name} accent={accent} tone="canvas" />
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-canvas/10" aria-label="Close menu" autoFocus>
                <X size={20} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-1" aria-label="Mobile">
              {[{ href: "/", label: "Home" }, ...nav].map((n, i) => (
                <motion.div key={n.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 300, damping: 28 }}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`block font-display text-[2.6rem] font-semibold leading-tight tracking-tight ${pathname === n.href ? "text-accent-2" : "text-canvas"}`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div className="mt-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Link href={cta.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-full bg-accent py-3 pl-6 pr-2 font-medium text-canvas">
                {cta.label}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-canvas/20">
                  <ArrowUpRight size={18} weight="bold" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
