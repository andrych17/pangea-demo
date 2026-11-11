import type { Metadata } from "next";
import { SettleExplorer } from "@/components/sections/SettleExplorer";
import { Eyebrow, SplitWords } from "@/components/motion";

export const metadata: Metadata = { title: "Settle in Australia", description: "Step-by-step guides for tax file number, banking, Medicare, licences and government services." };

export default function SettlePage() {
  return (
    <>
      <section className="px-4 pb-14 pt-32 md:px-10 md:pb-20 md:pt-40" aria-labelledby="settle-title">
        <div className="mx-auto max-w-[1400px]">
          <Eyebrow tone="accent">Settle in Australia</Eyebrow>
          <h1 id="settle-title" className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-balance">
            <SplitWords text="Everything you need to start right." play accents={{ "start": "font-serif font-normal italic text-accent" }} />
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">Step-by-step guides for the most important moments in your first weeks, available in 13 languages inside the Pangea app.</p>
        </div>
      </section>
      <SettleExplorer />
    </>
  );
}
