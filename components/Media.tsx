import Image from "next/image";
import type { Visual } from "@/lib/content";
import { ArtPanel } from "./ArtPanel";

/** Renders a preset visual: the photo when there is one, otherwise a themed ArtPanel. Parent needs a size and `relative`. */
export function Media({ visual, sizes, priority, variant = 0, bare, className }: { visual: Visual; sizes: string; priority?: boolean; variant?: number; bare?: boolean; className?: string }) {
  if (visual.photo) {
    return <Image src={visual.photo} alt={visual.alt} fill sizes={sizes} priority={priority} className={`object-cover ${className ?? ""}`} />;
  }
  return <ArtPanel icon={visual.icon} label={visual.alt} variant={variant} bare={bare} className={className} />;
}
