import { Eyebrow, Reveal, Shell } from "../motion";

/** Founder card from the brief. The photo slot shows initials until the real photo arrives. */
export function Founder({ name, title, badge, quote }: { name: string; title: string; badge: string; quote: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <section aria-labelledby="founder-title" className="px-4 py-24 md:px-10 md:py-32">
      <Reveal className="mx-auto max-w-[1100px]">
        <Shell inner="grid grid-cols-1 items-center gap-10 bg-card p-8 md:grid-cols-12 md:p-14">
          <div className="relative mx-auto aspect-square w-56 md:col-span-4 md:w-full">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-deep to-deep-2" />
            <span className="absolute inset-0 grid place-items-center font-display text-7xl font-semibold text-canvas/90">{initials}</span>
            <span className="absolute -bottom-4 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-2 px-4 py-2 text-xs font-semibold text-deep shadow-lg rtl:translate-x-1/2">{badge}</span>
          </div>
          <div className="md:col-span-8">
            <Eyebrow tone="accent">For migrants, by migrants</Eyebrow>
            <p className="mt-6 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.02em]">{quote}</p>
            <p id="founder-title" className="mt-8 font-semibold">{name}</p>
            <p className="text-sm text-ink-soft">{title}</p>
          </div>
        </Shell>
      </Reveal>
    </section>
  );
}
