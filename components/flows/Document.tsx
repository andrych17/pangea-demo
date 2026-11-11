import Link from "next/link";
import type { DocBlock, DocContent } from "@/lib/content";
import { Icon } from "../Icon";
import { Eyebrow, Reveal } from "../motion";
import { PrintButton } from "./PrintButton";

/**
 * Printable document page: a screen-only header (title, Save as PDF, optional source files), then the document itself.
 * The document has no scroll animation on purpose, so print and PDF always show every block.
 * Everything marked data-noprint is hidden by the print CSS in globals.css.
 */
export function Document({ content, backHref = "/dashboard", backLabel = "Back to the app" }: { content: DocContent; backHref?: string; backLabel?: string }) {
  const { doc } = content;
  return (
    <div className="px-4 pb-10 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1100px]">
        <div data-noprint>
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow tone="accent">Live demo</Eyebrow>
              <h1 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">{content.title}</h1>
              <p className="mt-4 max-w-xl text-lg text-ink-soft">{content.intro}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PrintButton />
              <Link href={backHref} className="inline-flex items-center rounded-full px-5 py-3 text-[15px] font-medium ring-1 ring-ink/15 transition-colors hover:bg-ink/[0.05]">
                {backLabel}
              </Link>
            </div>
          </Reveal>

          {content.sources && content.sources.length > 0 && (
            <Reveal delay={0.08} className="mt-10">
              <div className="rounded-[2rem] bg-ink/[0.04] p-1.5 ring-1 ring-ink/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-card p-5 md:p-6">
                  <p className="text-sm font-medium">Built from these files</p>
                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {content.sources.map((f) => (
                      <li key={f.name} className="flex items-start gap-3 rounded-2xl bg-canvas p-3">
                        <Icon name="FileText" size={20} className="mt-0.5 shrink-0 text-accent" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{f.name}</span>
                          <span className="block text-xs text-ink-soft">{f.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <article data-doc className="mt-8 rounded-[2rem] bg-card p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] ring-1 ring-ink/5 md:p-12">
          <header className="flex flex-col justify-between gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{doc.kicker}</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{doc.title}</p>
              <p className="mt-2 text-ink-soft">{doc.subtitle}</p>
              <p className="mt-1 text-sm text-ink-soft">{doc.meta}</p>
            </div>
            <div className="grid h-20 w-40 shrink-0 place-items-center rounded-2xl border border-dashed border-ink/20 text-xs text-ink-soft">Your logo</div>
          </header>
          {doc.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
          <p className="mt-12 border-t border-ink/10 pt-6 text-xs leading-relaxed text-ink-soft">{doc.footer}</p>
        </article>
      </div>
    </div>
  );
}

export function Tile({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${dark ? "bg-deep text-canvas" : "bg-canvas"}`}>
      <p className={`text-xs ${dark ? "text-canvas/70" : "text-ink-soft"}`}>{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em]">{value}</p>
    </div>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="mt-12 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{block.text}</h2>;
    case "text":
      return <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{block.text}</p>;
    case "tiles":
      return (
        <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
          {block.items.map((t) => (
            <Tile key={t.label} {...t} />
          ))}
        </div>
      );
    case "table":
      return (
        <div className="mt-5">
          <div className="overflow-x-auto">
            {/* Up to 3 columns wrap to fit a phone. Wider tables keep 130px per column and scroll inside the wrapper, not the page. */}
            <table className="w-full text-left text-sm" style={block.columns.length > 3 ? { minWidth: `${block.columns.length * 130}px` } : undefined}>
              <thead className="text-ink-soft">
                <tr>
                  {block.columns.map((c) => (
                    <th key={c} className="py-2 pr-3 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-ink/10 align-top">
                    {row.map((cell, c) => (
                      <td key={c} className={`py-2.5 pr-3 ${c === 0 ? "font-medium" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="mt-3 text-xs text-ink-soft">{block.note}</p>}
        </div>
      );
    case "callout":
      return (
        <div className="mt-8 rounded-[1.6rem] bg-deep p-6 text-canvas md:p-8">
          <p className="font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{block.title}</p>
          <p className="mt-3 max-w-3xl text-canvas/80">{block.body}</p>
        </div>
      );
    case "list":
      return (
        <ul className="mt-5 space-y-2">
          {block.items.map((it) => (
            <li key={it.title} className="rounded-2xl bg-canvas p-4 text-sm">
              <span className="font-medium">{it.title}</span> <span className="text-ink-soft">{it.body}</span>
            </li>
          ))}
        </ul>
      );
  }
}
