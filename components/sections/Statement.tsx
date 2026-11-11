import type { HomeContent } from "@/lib/content";
import { TextScrub, VelocityMarquee } from "../motion";

/** Two marquees that speed up with scroll velocity, then a paragraph whose words light up as you read. */
export function Statement({ marquee, statement }: { marquee: HomeContent["marquee"]; statement: HomeContent["statement"] }) {
  const accents = Object.fromEntries(statement.accentWords.map((w) => [w, "font-serif italic text-accent"]));
  return (
    <>
      <div className="-rotate-1 bg-deep py-5 text-canvas md:py-7" aria-hidden>
        <VelocityMarquee items={marquee[0]} className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-semibold tracking-tight" />
        <VelocityMarquee items={marquee[1]} reverse base={1.6} className="mt-2 font-serif text-[clamp(1.3rem,2.6vw,2.2rem)] italic text-accent-2" />
      </div>
      <section className="px-4 py-28 md:px-10 md:py-40">
        <TextScrub text={statement.text} accents={accents} className="mx-auto max-w-[1100px] font-display text-[clamp(1.9rem,4.4vw,4rem)] font-medium leading-[1.08] tracking-[-0.03em]" />
      </section>
    </>
  );
}
