"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CheckCircle, Info } from "@phosphor-icons/react";
import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";

type Toast = { id: number; text: string; tone: "ok" | "info" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});

/** `const toast = useToast(); toast("Saved")` or `toast("Check the form", "info")`. */
export const useToast = () => useContext(ToastCtx);

// Intro gate: hero animations wait until the preloader starts lifting.
let introDone = false;
const introListeners = new Set<() => void>();

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  introListeners.forEach((l) => l());
}

/** True once the preloader is lifting (or was already played in this tab). Use it as `play` / `animate` gate on hero motion. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (l) => {
      introListeners.add(l);
      return () => introListeners.delete(l);
    },
    () => introDone || document.documentElement.dataset.intro === "done",
    () => false,
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "done") markIntroDone();
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
      <ToastCtx.Provider value={push}>
        {children}
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4">
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.18 } }}
                className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-3 pr-5 text-sm text-canvas shadow-[0_18px_40px_-18px_rgba(22,21,15,0.6)]"
              >
                {t.tone === "ok" ? <CheckCircle size={18} weight="fill" className="text-accent-2" /> : <Info size={18} weight="fill" className="text-accent-2" />}
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ToastCtx.Provider>
    </MotionConfig>
  );
}
