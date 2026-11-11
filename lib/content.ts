import type { IconName } from "../components/Icon.tsx";
import type { FontPairing, ThemeName } from "./themes.ts";

/**
 * Shape of a sector preset. Everything is plain data (strings, numbers, arrays):
 * server pages read it and pass slices to client sections.
 */

/** A photo when you have one, else an icon drawn on a themed ArtPanel. `alt` describes either. */
export type Visual = { icon: IconName; alt: string; photo?: string };
export type LinkItem = { label: string; href: string };

export type HomeContent = {
  hero: {
    eyebrow: string;
    /** Words listed in `accentWords` (exact match, punctuation included) render in the italic serif accent. */
    title: string;
    accentWords: string[];
    body: string;
    primary: LinkItem;
    secondary: LinkItem;
    /** Text that runs around the spinning badge. End it with " • ". */
    badge: string;
    badgeCenter: string;
    visuals: [Visual, Visual, Visual];
    stats: { value: number; prefix?: string; suffix?: string; label: string }[];
  };
  marquee: [string[], string[]];
  statement: { text: string; accentWords: string[] };
  features: { eyebrow: string; title: string; items: [Feature, Feature, Feature, Feature] };
  showcase: { eyebrow: string; title: string; body: string; cards: { title: string; body: string; tag: string; visual: Visual }[] };
  steps: { eyebrow: string; title: string; items: { title: string; body: string; icon: IconName }[] };
  cta: { eyebrow: string; title: string; accent: string; body: string; button: LinkItem; visual: Visual };
};

export type Feature = { title: string; body: string; icon: IconName; stat?: { value: number; prefix?: string; suffix?: string; label: string } };

/** The example app page (/dashboard): one list of records moving through three statuses. */
export type AppContent = {
  title: string;
  intro: string;
  singular: string;
  plural: string;
  statuses: [string, string, string];
  metaLabel: string;
  placeholder: { title: string; meta: string };
  seed: { title: string; meta: string; status: 0 | 1 | 2 }[];
};

/** One block of the printable document on /report. The page renders them in order. */
export type DocBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "tiles"; items: { label: string; value: string; dark?: boolean }[] }
  | { type: "table"; columns: string[]; rows: string[][]; note?: string }
  | { type: "callout"; title: string; body: string }
  | { type: "list"; items: { title: string; body: string }[] };

/** The document page (/report): a report, quote or invoice the client can save as PDF. */
export type DocContent = {
  title: string;
  intro: string;
  /** Optional "Built from these files" panel above the document, for data-extraction demos. */
  sources?: { name: string; detail: string }[];
  doc: { kicker: string; title: string; subtitle: string; meta: string; blocks: DocBlock[]; footer: string };
};

/** The scripted assistant (/assistant). Replies are matched by keyword, no API call. */
export type ChatContent = {
  title: string;
  intro: string;
  assistant: string;
  greeting: string;
  suggestions: string[];
  replies: { keywords: string[]; answer: string }[];
  fallback: string;
  /** Side panel: how the real version would work. */
  notes: string[];
};

export type Preset = {
  sector: string;
  /** Who this preset suits, for AGENTS.md and humans picking one. */
  fits: string;
  theme: ThemeName;
  fonts: FontPairing;
  brand: { name: string; accent: string; tagline: string; description: string };
  nav: LinkItem[];
  cta: LinkItem;
  home: HomeContent;
  app: AppContent;
  /** Leave these out to get a version built from the rest of the preset (lib/flows.ts). Write them per job. */
  doc?: DocContent;
  chat?: ChatContent;
  /** Search terms for scripts/photos.py when the demo needs real photos. */
  photoQueries: string[];
};
