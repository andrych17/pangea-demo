import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, ReactNode } from "react";

type Tone = "ink" | "canvas" | "accent";
const TONES: Record<Tone, string> = {
  ink: "bg-ink text-canvas",
  canvas: "bg-canvas text-ink",
  accent: "bg-accent text-white",
};
const DOT: Record<Tone, string> = { ink: "bg-canvas/15", canvas: "bg-ink/10", accent: "bg-white/20" };

/** Pill link with the arrow in its own circle; the arrow slides out and a new one slides in on hover. */
export function ArrowLink({ href, children, tone = "ink", className, ...rest }: { href: string; children: ReactNode; tone?: Tone; className?: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-medium transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-[1.02] active:scale-[0.98] ${TONES[tone]} ${className ?? ""}`}
      {...rest}
    >
      {children}
      <span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full ${DOT[tone]}`}>
        <span className="relative block h-4 w-4">
          <ArrowUpRight size={16} weight="bold" className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-5 group-hover:translate-x-5" />
          <ArrowUpRight size={16} weight="bold" className="absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </span>
    </Link>
  );
}
