"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { resetDemoData } from "@/lib/demo-store";
import { useToast } from "./Providers";

/** Footer button: puts the demo back to its seed data in every open tab. Handy right before a client call. */
export function ResetDemo({ prefix }: { prefix: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        resetDemoData(prefix);
        toast("Demo data reset", "info");
      }}
      className="inline-flex items-center gap-2 self-start rounded-full bg-canvas/10 px-4 py-2 text-canvas/80 transition-colors hover:bg-canvas/20"
    >
      <ArrowCounterClockwise size={14} /> Reset demo data
    </button>
  );
}
