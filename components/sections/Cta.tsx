import type { HomeContent } from "@/lib/content";
import { ArrowLink, ClipReveal, Eyebrow, Magnetic } from "../motion";

/** Closing band: the visual opens from a rounded window to full width, then the copy rises. */
export function Cta({ cta }: { cta: HomeContent["cta"] }) {
  return (
    <ClipReveal visual={cta.visual}>
      <Eyebrow tone="dark">{cta.eyebrow}</Eyebrow>
      <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
        {cta.title} <span className="font-serif font-normal italic text-accent-2">{cta.accent}</span>
      </h2>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-canvas/75">{cta.body}</p>
      <div className="mt-10">
        <Magnetic className="inline-block">
          <ArrowLink href={cta.button.href} tone="canvas">
            {cta.button.label}
          </ArrowLink>
        </Magnetic>
      </div>
    </ClipReveal>
  );
}
