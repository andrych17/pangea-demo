/**
 * Generic wordmark: brand initial in a rounded tile plus "Name Accent". Colours come from the theme,
 * so it fits every preset. Replace with the client's SVG logo when they send one.
 */
export function Logo({ name, accent, tone = "ink", size = "md" }: { name: string; accent: string; tone?: "ink" | "canvas"; size?: "md" | "lg" }) {
  return (
    <span className="group inline-flex items-center gap-2.5">
      {/* Client's own globe mark, shared in the job post. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- 128px PNG, no optimisation needed */}
      <img src="/logo.png" alt="" width={64} height={64} className={`${size === "lg" ? "h-10 w-10" : "h-8 w-8"} shrink-0 transition-transform duration-700 ease-[var(--ease-spring)] group-hover:rotate-[14deg]`} />
      <span className={`font-display font-semibold tracking-tight ${size === "lg" ? "text-2xl" : "text-lg"} ${tone === "canvas" ? "text-canvas" : "text-ink"}`}>
        {name}
        {accent && <span className={`ml-1.5 font-serif font-normal italic ${size === "lg" ? "text-[1.7rem]" : "text-xl"} ${tone === "canvas" ? "text-accent-2" : "text-accent"}`}>{accent}</span>}
      </span>
    </span>
  );
}
