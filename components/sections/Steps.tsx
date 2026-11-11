import type { HomeContent } from "@/lib/content";
import { Icon } from "../Icon";
import { ArrowLink, Eyebrow, Reveal, StickyStack } from "../motion";

// Card colours cycle through the theme so the stack reads as separate sheets.
const TONES = ["bg-deep text-canvas", "bg-accent text-canvas", "bg-accent-2 text-ink", "bg-accent-3 text-canvas", "bg-ink text-canvas"];

/** Sticky heading on the left, cards stacking on the right. Anchor: /#process. */
export function Steps({ steps }: { steps: HomeContent["steps"] }) {
  return (
    <section id="process" className="scroll-mt-20 px-4 py-24 md:px-10 md:py-36" aria-labelledby="steps-title">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-32">
            <Eyebrow>{steps.eyebrow}</Eyebrow>
            <h2 id="steps-title" className="mt-5 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance">
              {steps.title}
            </h2>
            <ol className="mt-10 hidden space-y-3 text-ink-soft lg:block">
              {steps.items.map((s, i) => (
                <li key={s.title} className="flex items-baseline gap-4">
                  <span className="font-display text-sm tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <ArrowLink href="/settle">Read the guides</ArrowLink>
            </div>
          </Reveal>
        </div>
        <StickyStack className="lg:col-span-7">
          {steps.items.map((s, i) => (
            <div key={s.title} className={`flex h-full flex-col justify-between p-8 md:p-12 ${TONES[i % TONES.length]}`}>
              <div className="flex items-start justify-between">
                <span className="font-display text-[clamp(4rem,9vw,8rem)] font-semibold leading-none tracking-[-0.06em] opacity-90">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-current/10">
                  <Icon name={s.icon} size={28} weight="duotone" />
                </span>
              </div>
              <div>
                <h3 className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-none tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed opacity-75">{s.body}</p>
              </div>
            </div>
          ))}
        </StickyStack>
      </div>
    </section>
  );
}
