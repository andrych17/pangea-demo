import type { Metadata, Viewport } from "next";
import { SITE } from "@/site.config";
import { BRAND, FONTS, PRESET, STORE_KEY, THEME } from "@/presets";
import { THEMES } from "@/lib/themes";
import { Providers } from "@/components/Providers";
import { Preloader } from "@/components/Preloader";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollProgress } from "@/components/motion";
import { DownloadBar } from "@/components/DownloadBar";
import { PLAY_URL } from "@/lib/i18n";
import { INTRO_KEY } from "@/lib/intro";
import { fontVars } from "./fonts";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
const fullName = BRAND.accent ? `${BRAND.name} ${BRAND.accent}` : BRAND.name;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: fullName, template: `%s | ${fullName}` },
  description: BRAND.description,
  openGraph: { type: "website", siteName: fullName },
  twitter: { card: "summary_large_image" },
  // Demo with made-up data: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: THEMES[THEME].deep };

// Runs before first paint: the intro plays once per tab and never flashes on later page loads.
const introScript = SITE.preloader.enabled
  ? `try{if(sessionStorage.getItem('${INTRO_KEY}'))document.documentElement.dataset.intro='done'}catch(e){}`
  : `document.documentElement.dataset.intro='done'`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.locale} data-theme={THEME} className={`${fontVars} fonts-${FONTS}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <Providers>
          {SITE.preloader.enabled && (
            <Preloader
              name={BRAND.name}
              accent={BRAND.accent}
              kicker={SITE.preloader.kicker}
              visuals={PRESET.home.hero.visuals}
              columns={SITE.preloader.columns}
              minMs={SITE.preloader.minMs}
            />
          )}
          <ScrollProgress />
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">
            Skip to content
          </a>
          <SiteHeader name={BRAND.name} accent={BRAND.accent} nav={PRESET.nav} cta={PRESET.cta} />
          <main id="main">{children}</main>
          <DownloadBar href={PLAY_URL} text="Pangea is free. Get the app." />
          <SiteFooter name={BRAND.name} accent={BRAND.accent} tagline={BRAND.tagline} nav={PRESET.nav} cta={PRESET.cta} note={SITE.footerNote} storePrefix={STORE_KEY} />
        </Providers>
      </body>
    </html>
  );
}
