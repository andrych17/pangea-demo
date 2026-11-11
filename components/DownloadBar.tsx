"use client";

import { GooglePlayLogo, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

/** Sticky bottom download bar from the brief. Shows after the hero, can be closed. */
export function DownloadBar({ href, text }: { href: string; text: string }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 520));

  return (
    <AnimatePresence>
      {show && !closed && (
        <motion.div
          data-noprint
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl items-center gap-3 rounded-full bg-deep py-2 pe-2 ps-5 text-canvas shadow-[0_20px_50px_-20px_rgba(30,58,95,0.8)] ring-1 ring-canvas/10"
        >
          <p className="min-w-0 flex-1 truncate text-sm">{text}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full bg-accent-2 px-4 py-2 text-sm font-semibold text-deep transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.04] active:scale-[0.98]"
          >
            <GooglePlayLogo size={18} weight="fill" />
            Google Play
          </a>
          <button type="button" onClick={() => setClosed(true)} aria-label="Close download bar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-canvas/60 hover:bg-canvas/10 hover:text-canvas">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
