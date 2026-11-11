import Link from "next/link";
import type { LinkItem } from "@/lib/content";
import { Logo } from "./Logo";

/** Dark footer with an oversized wordmark that bleeds off the bottom edge. */
export function SiteFooter({ name, accent, tagline, nav, cta, note, storePrefix }: { name: string; accent: string; tagline: string; nav: LinkItem[]; cta: LinkItem; note: string; storePrefix: string }) {
  return (
    <footer data-noprint className="relative mt-24 overflow-hidden bg-deep text-canvas">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 pb-10 pt-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <Logo name={name} accent={accent} tone="canvas" size="lg" />
          <p className="mt-6 max-w-md text-canvas/60">{tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm md:col-span-3 md:col-start-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-canvas/40">Explore</p>
          <Link href="/" className="w-fit hover:text-accent-2">Home</Link>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="w-fit hover:text-accent-2">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 text-sm md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-canvas/40">Next step</p>
          <Link href={cta.href} className="w-fit font-medium text-accent-2 hover:text-canvas">
            {cta.label}
          </Link>
        </div>
      </div>

      <p aria-hidden className="pointer-events-none select-none whitespace-nowrap px-4 font-display text-[clamp(4.5rem,19vw,20rem)] font-semibold leading-[0.78] tracking-[-0.06em] text-canvas/[0.07] md:px-8">
        {name}
        {accent && <span className="font-serif font-normal italic"> {accent}</span>}
      </p>

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-canvas/10 px-6 py-6 text-xs text-canvas/50 md:flex-row md:items-center md:justify-between md:px-10">
        <p>{note}</p>
        
      </div>
    </footer>
  );
}
