import { SITE, type Sector } from "../site.config.ts";
import type { Preset } from "../lib/content.ts";
import { chatFromPreset, docFromPreset } from "../lib/flows.ts";
import { creative } from "./creative.ts";
import { saas } from "./saas.ts";
import { health } from "./health.ts";
import { food } from "./food.ts";
import { property } from "./property.ts";
import { retail } from "./retail.ts";
import { education } from "./education.ts";
import { events } from "./events.ts";
import { professional } from "./professional.ts";
import { logistics } from "./logistics.ts";

/**
 * Server-only on purpose: import this from pages and layouts, then pass slices to client components as props.
 * Importing it inside a "use client" file would ship every preset's copy to the browser.
 */
export const PRESETS: Record<Sector, Preset> = { creative, saas, health, food, property, retail, education, events, professional, logistics };

export const PRESET = PRESETS[SITE.sector];
export const THEME = SITE.theme ?? PRESET.theme;
export const FONTS = SITE.fonts ?? PRESET.fonts;
export const BRAND = PRESET.brand;
/** Content for /report and /assistant: the preset's own block, or one built from the rest of the preset. */
export const DOC = PRESET.doc ?? docFromPreset(PRESET);
export const CHAT = PRESET.chat ?? chatFromPreset(PRESET);
/** Storage namespace for the demo data. Changing sector starts from fresh seed data. */
export const STORE_KEY = `${SITE.slug}-${SITE.sector}-v1`;
