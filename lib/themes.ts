/**
 * Palettes live in app/globals.css as [data-theme="..."] blocks. This list must match them.
 * `deep` feeds the browser theme colour; keep it equal to --color-deep of that block.
 */
export const THEMES = {
  ember: { deep: "#10241f", mood: "Warm paper, forest green, vermilion. Creative, food, culture." },
  clinic: { deep: "#0d3b3a", mood: "Cool mint white, deep teal, soft coral. Health, wellness, care." },
  signal: { deep: "#0c1322", mood: "Off-white, midnight navy, electric blue and lime. SaaS, AI, fintech." },
  stone: { deep: "#23262b", mood: "Stone, charcoal, brass. Property, construction, architecture." },
  harbor: { deep: "#0f2a44", mood: "Linen, navy, brick and gold. Finance, insurance, legal, consulting." },
  pangea: { deep: "#1e3a5f", mood: "Slate white, navy, teal and gold. Pangea brand colours from the brief." },
  bloom: { deep: "#25305e", mood: "Cream, ink blue, coral and sunflower. Education, kids, community." },
  noir: { deep: "#151311", mood: "Bone, near-black, gold. Luxury, fashion, beauty, hospitality." },
  market: { deep: "#3a1f14", mood: "Warm white, espresso, tomato and turmeric. Retail, groceries, cafés." },
  route: { deep: "#14231c", mood: "Concrete, deep green, safety orange. Logistics, fleet, field services." },
} as const;

export type ThemeName = keyof typeof THEMES;

/** Font pairings declared in app/fonts.ts. Display face changes; serif accent and body stay. */
export const FONT_PAIRINGS = {
  editorial: "Bricolage Grotesque display. Expressive, warm.",
  modern: "Plus Jakarta Sans display. Clean product and SaaS feel.",
  classic: "Fraunces display (soft serif). Trust, heritage, premium.",
  tech: "Space Grotesk display. Technical, logistics, data.",
} as const;

export type FontPairing = keyof typeof FONT_PAIRINGS;
