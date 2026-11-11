import type { Feature, HomeContent } from "@/lib/content";
import { Icon } from "../Icon";
import { CountUp, Eyebrow, Reveal, Shell, TiltCard } from "../motion";

// Asymmetric bento: wide + narrow, then narrow + wide. The last card is dark for rhythm.
const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

export function Features({ features }: { features: HomeContent["features"] }) {
  return (
    <section className="px-4 pb-24 md:px-10 md:pb-36" aria-labelledby="features-title">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="max-w-3xl">
          <Eyebrow>{features.eyebrow}</Eyebrow>
          <h2 id="features-title" className="mt-5 font-display text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance">
            {features.title}
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12">
          {features.items.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className={SPANS[i]}>
              <TiltCard className="h-full">
                <FeatureCard f={f} dark={i === 3} big={i === 0 || i === 3} />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ f, dark, big }: { f: Feature; dark: boolean; big: boolean }) {
  return (
    <Shell dark={dark} className="h-full" inner={`relative flex h-full min-h-[280px] flex-col justify-between gap-10 overflow-hidden p-7 md:p-9 ${big ? "md:min-h-[340px]" : ""}`}>
      {/* Oversized ghost icon fills the empty corner and gives each card its own texture. */}
      <Icon name={f.icon} size={260} weight="thin" className={`pointer-events-none absolute -bottom-12 -right-10 ${dark ? "text-canvas/[0.06]" : "text-ink/[0.045]"}`} />
      <div className="relative flex items-start justify-between gap-6">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${dark ? "bg-canvas/10 text-accent-2" : "bg-accent/10 text-accent"}`}>
          <Icon name={f.icon} size={24} weight="duotone" />
        </span>
        {f.stat && (
          <div className="text-right">
            <p className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-none tracking-[-0.04em]">
              <CountUp to={f.stat.value} prefix={f.stat.prefix} suffix={f.stat.suffix} />
            </p>
            <p className={`mt-1 text-sm ${dark ? "text-canvas/60" : "text-ink-soft"}`}>{f.stat.label}</p>
          </div>
        )}
      </div>
      <div className="relative">
        <h3 className={`font-display font-semibold tracking-tight ${big ? "text-3xl md:text-4xl" : "text-2xl"}`}>{f.title}</h3>
        <p className={`mt-3 max-w-md leading-relaxed ${dark ? "text-canvas/70" : "text-ink-soft"}`}>{f.body}</p>
      </div>
    </Shell>
  );
}
