"use client";

import { FilePdf } from "@phosphor-icons/react";

/** Opens the print dialog. "Save as PDF" there gives the same file a real server-side PDF export would. Print CSS lives in globals.css. */
export function PrintButton({ label = "Save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      data-print
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-canvas transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-[1.02] active:scale-[0.98]"
    >
      <FilePdf size={18} aria-hidden />
      {label}
    </button>
  );
}
