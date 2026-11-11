import { STATS } from "@/lib/pangea";
import { CountUp, Reveal } from "../motion";

/** Four headline numbers on a dark band. Figures come from pangeaconnects.com. */
export function Stats() {
  return (
    <section aria-label="Pangea in numbers" className="bg-deep px-4 py-16 text-canvas md:px-10 md:py-20">
      <dl className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-t border-canvas/15 pt-5">
            <dd className="font-display text-[clamp(3rem,6.5vw,5.6rem)] font-semibold leading-none tracking-[-0.04em]">
              <CountUp to={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-3 text-sm text-canvas/60">{s.label}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
