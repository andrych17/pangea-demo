import type { FontPairing, ThemeName } from "./lib/themes.ts";

/**
 * One file to point the starter at a client.
 * 1. Pick the closest `sector` (table in AGENTS.md). It sets palette, fonts, homepage copy and the app page.
 * 2. Edit that preset in presets/<sector>.ts with the client's real copy.
 * 3. Optional: override the palette, font pairing or motion style here without touching the preset.
 * Preview without editing: NEXT_PUBLIC_SECTOR=health npm run dev, NEXT_PUBLIC_MOTION=pop npm run dev
 */
export const SECTORS = ["creative", "saas", "health", "food", "property", "retail", "education", "events", "professional", "logistics"] as const;
export type Sector = (typeof SECTORS)[number];
/** How the site moves: scroll reveals, page transitions, headline words and the preloader exit (lib/motion-styles.ts). */
export const MOTION_STYLES = ["silk", "snap", "editorial", "pop"] as const;
export type MotionStyle = (typeof MOTION_STYLES)[number];

type SiteConfig = {
  /** Prefix for browser storage keys. Lowercase, no spaces. */
  slug: string;
  sector: Sector;
  theme?: ThemeName;
  fonts?: FontPairing;
  /** Leave out to use the sector's default (SECTOR_MOTION in lib/motion-styles.ts). */
  motion?: MotionStyle;
  locale: string;
  /** All dates render in this zone on server and client, so hydration never depends on the machine clock. */
  timeZone: string;
  preloader: {
    enabled: boolean;
    /** Minimum time on screen. It also waits for web fonts, capped at 4 seconds. */
    minMs: number;
    /** Curtain columns (or blinds rows) on exit, for the silk and editorial styles. 4 to 7 looks right. */
    columns: number;
    kicker: string;
  };
  footerNote: string;
};

const envSector = process.env.NEXT_PUBLIC_SECTOR;
const envMotion = process.env.NEXT_PUBLIC_MOTION;

export const SITE: SiteConfig = {
  slug: "pangea",
  sector: envSector && (SECTORS as readonly string[]).includes(envSector) ? (envSector as Sector) : "education",
  // theme: "noir",
  // fonts: "classic",
  motion: envMotion && (MOTION_STYLES as readonly string[]).includes(envMotion) ? (envMotion as MotionStyle) : "silk",
  locale: "en-AU",
  timeZone: "UTC",
  preloader: { enabled: true, minMs: 2000, columns: 5, kicker: "Welcome home" },
  footerNote: "Pitch demo for Pangea Connects Pty Ltd. Copy from the brief; translations are drafts; photos from pangeaconnects.com; feature text, guide details and plan inclusions are placeholders to verify; service providers are made up.",
};
