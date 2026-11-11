import type { ReactNode } from "react";

/** Double-bezel card: thin outer ring, concentric inner core. Put padding on `inner`. */
export function Shell({ children, className, inner, dark }: { children: ReactNode; className?: string; inner?: string; dark?: boolean }) {
  return (
    <div className={`rounded-[2rem] p-1.5 ${dark ? "bg-canvas/[0.06] ring-1 ring-canvas/10" : "bg-ink/[0.035] ring-1 ring-ink/5"} ${className ?? ""}`}>
      <div
        className={`h-full rounded-[calc(2rem-0.375rem)] ${
          dark ? "bg-deep text-canvas shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" : "bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_50px_-30px_rgba(22,21,15,0.35)]"
        } ${inner ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Small uppercase pill above a heading. */
export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" | "accent" }) {
  const cls = tone === "dark" ? "bg-canvas/10 text-canvas/80" : tone === "accent" ? "bg-accent/10 text-accent" : "bg-ink/[0.06] text-ink-soft";
  return <span className={`eyebrow ${cls}`}>{children}</span>;
}
