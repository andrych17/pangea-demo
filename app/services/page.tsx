import type { Metadata } from "next";
import { ServiceDirectory } from "@/components/sections/ServiceDirectory";
import { Eyebrow, SplitWords } from "@/components/motion";

export const metadata: Metadata = { title: "Find Services", description: "Verified doctors, lawyers, migration agents, accountants and trades who speak your language." };

export default function ServicesPage() {
  return (
    <>
      <section className="px-4 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40" aria-labelledby="services-title">
        <div className="mx-auto max-w-[1400px]">
          <Eyebrow tone="accent">Services Directory</Eyebrow>
          <h1 id="services-title" className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-balance">
            <SplitWords text="Professionals who speak your language." play accents={{ speak: "font-serif font-normal italic text-accent" }} />
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">Every provider is checked before they appear here, and lists the languages they work in. Names below are samples for this demo.</p>
        </div>
      </section>
      <ServiceDirectory />
    </>
  );
}
