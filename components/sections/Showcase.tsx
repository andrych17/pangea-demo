import type { HomeContent } from "@/lib/content";
import { Media } from "../Media";
import { Eyebrow, HorizontalRail } from "../motion";

/** Pinned sideways rail on desktop, swipe row on mobile. Anchor /#work is set by the page that wraps it. */
export function Showcase({ showcase }: { showcase: HomeContent["showcase"] }) {
  return (
    <div className="bg-canvas-2/60">
      <HorizontalRail
        label={showcase.title}
        intro={
          <div>
            <Eyebrow tone="accent">{showcase.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{showcase.title}</h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink-soft">{showcase.body}</p>
          </div>
        }
      >
        {showcase.cards.map((c, i) => (
          <article key={c.title} className="group w-[78vw] max-w-[420px] shrink-0 sm:w-[420px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-ink/5">
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
                <Media visual={c.visual} sizes="(min-width:640px) 420px, 78vw" variant={i} />
              </div>
              <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">{c.tag}</span>
            </div>
            <h3 className="mt-5 flex items-baseline gap-3 font-display text-2xl font-semibold tracking-tight">
              <span className="text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
              {c.title}
            </h3>
            <p className="mt-2 max-w-sm leading-relaxed text-ink-soft">{c.body}</p>
          </article>
        ))}
      </HorizontalRail>
    </div>
  );
}
