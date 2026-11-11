import { Bricolage_Grotesque, DM_Sans, Fraunces, Instrument_Serif, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

/*
 * Body (Geist) and accent serif (Instrument Serif) are shared and preloaded.
 * The four display faces are declared with preload off: the browser only downloads the one the
 * active pairing actually uses (globals.css maps it via .fonts-<pairing>), and the preloader covers the swap.
 * To add a pairing: declare the font here, add it to `fontVars`, add a .fonts-<name> block in globals.css and a key in lib/themes.ts.
 */
// Pangea brief: DM Sans body (keeps the --f-geist variable name so globals.css stays untouched).
const sans = DM_Sans({ subsets: ["latin", "latin-ext"], variable: "--f-geist", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-instrument", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage", display: "swap", axes: ["opsz", "wdth"], preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--f-jakarta", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--f-fraunces", display: "swap", axes: ["SOFT", "opsz"], preload: false });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--f-space", display: "swap", preload: false });

export const fontVars = [sans, serif, bricolage, jakarta, fraunces, space].map((f) => f.variable).join(" ");
