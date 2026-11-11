# demo-starter

Starter for Upwork pitch demos: a homepage with a preloader and scroll motion, plus three working flows to pick from (`/dashboard` records board, `/report` printable document, `/assistant` scripted AI chat), themed for any sector. Copy it, pick a sector, keep the flows the brief needs, rewrite the copy, ship. Do not rebuild the motion or the layout from scratch.

Stack: Next.js 16 App Router (Turbopack), React 19, TypeScript, Tailwind v4, `motion` (`motion/react`), Phosphor icons. No backend. The board keeps its data in localStorage and syncs between tabs; the chat answers by keyword in the browser.

## Start a demo

```bash
cd ~/projects/personal/upwork/jobs
mkdir -p <slug>/local
rsync -a --exclude .git --exclude .next --exclude node_modules --exclude local demo-starter/ <slug>/site/
cd <slug>/site && npm ci
```

The code goes in `site/` so the folder already matches `jobs/PROSEDUR.md` §0 if the client hires.

1. `site.config.ts`: set `slug` (it namespaces localStorage and sessionStorage), `sector`, `locale`, `timeZone`. Leave `theme`/`fonts`/`motion` unset unless the brand needs a different look or feel (see Motion styles).
2. `presets/<sector>.ts`: rewrite brand, nav, every homepage section and the `app` block (entity name, three statuses, seed rows) from the client's brief. Add a `doc` and/or `chat` block for the flows you keep (see Flows). The test files check counts, accent words and that every chat suggestion gets a real answer, so `npm test` tells you what you broke.
3. Delete the flow folders you do not use (`rm -r app/assistant`, `rm -r app/report`, or `app/dashboard`) and point `nav`/`cta` at the ones you keep.
4. Photos: keep the ArtPanel stand-ins, or fetch CC0 photos with `scripts/photos.py` (see Photos) and set `photo` on the visuals.
5. `npm run dev` while editing. Stop it before `npm run check`.
6. `npm run check` must print `OK` before you deploy.

To preview another sector or motion style without editing files: `NEXT_PUBLIC_SECTOR=health npm run dev`, `NEXT_PUBLIC_MOTION=pop npm run dev` (both can be combined).

## Scope (keep it small)

* Homepage plus one or two flows, three routes at most, two to three hours. A demo that wins the reply is worth more than a demo that covers the whole brief.
* Build a demo only when the job's "chance dilihat" is high (upwork `AGENTS.md` §4). For a medium chance, a strong hook in the cover letter is cheaper.
* All names and data are made up. Keep `footerNote` visible. Never copy a real brand's site, logo or trademarks, and do not use the client's logo unless they shared it.
* Change copy before structure. Swap a section only when the brief really needs something else (a menu, a map, a booking calendar).

## Sectors

| `sector` | Fits | Theme | Fonts |
|---|---|---|---|
| creative | Agencies, studios, freelancers, portfolios, photographers, makers | ember | editorial |
| saas | SaaS, AI tools, fintech, B2B software, internal tools, MVP dashboards | signal | modern |
| health | Clinics, dentists, physio, gyms, wellness, therapists, care homes, pharmacies | clinic | modern |
| food | Restaurants, cafés, bakeries, catering, bars, food trucks, meal prep | market | classic |
| property | Real estate, builders, renovation, architects, interior design, property management | stone | classic |
| retail | Shops, e-commerce, fashion, beauty, salons, boutiques, product brands | noir | modern |
| education | Schools, tutoring, online courses, coaching, nurseries, music lessons, community groups | bloom | editorial |
| events | Festivals, venues, conferences, weddings, ticketing, sports clubs, tours, nightlife | ember | tech |
| professional | Accountants, lawyers, insurance, consultants, finance, recruiters | harbor | classic |
| logistics | Freight, couriers, fleet, warehousing, field services, cleaning, trades, removals | route | tech |

Themes (palettes in `app/globals.css`, list in `lib/themes.ts`): ember, clinic, signal, stone, harbor, bloom, noir, market, route. Font pairings (`app/fonts.ts`): editorial (Bricolage Grotesque), modern (Plus Jakarta Sans), classic (Fraunces), tech (Space Grotesk). Body is Geist and the italic accent is Instrument Serif in every pairing.

New palette: copy a `[data-theme="..."]` block in `globals.css`, add the key to `THEMES` with `deep` equal to its `--color-deep`. New pairing: follow the comment at the top of `app/fonts.ts`.

## File map

```
site.config.ts            slug, sector, locale/timezone, preloader settings, optional theme/fonts override
presets/<sector>.ts       all copy and demo data for one sector (plain serialisable data)
presets/index.ts          PRESET, THEME, FONTS, BRAND, DOC, CHAT, STORE_KEY. Server components only.
app/layout.tsx            fonts, theme, preloader, header, footer, scroll progress
app/page.tsx              homepage: Hero, Statement, Features, Showcase, Steps, Cta
app/dashboard/page.tsx    flow: records board (Board)
app/report/page.tsx       flow: printable document (Document)
app/assistant/page.tsx    flow: scripted AI chat (Chat)
app/template.tsx          page-change transition
components/sections/      homepage sections, each takes its slice of the preset as props
components/motion/        motion kit (below)
components/dashboard/     Board: stats, filter tabs, list, validated add form
components/flows/         Document (+ Tile, PrintButton) and Chat
lib/                      demo store, board and flow logic, motion styles, validation, date formatting, themes (with tests)
scripts/                  check.sh, smoke.py, shot.py, photos.py
local/                    gitignored scratch (screenshots)
```

Only server components import `@/presets`. They pass plain slices (strings, numbers, arrays, plain objects) to client components. Functions and React components cannot cross that boundary, which is why icons are strings (`components/Icon.tsx`) and accents are `{ word: classes }` maps.

## Flows

Keep the one or two that match the brief, delete the other folders. Each works with no extra copy: when the preset has no `doc` or `chat` block, `lib/flows.ts` builds one from the rest of the preset (the board's records, the features, the steps). Write the real block per job.

| Route | Use for | Content | Notes |
|---|---|---|---|
| `/dashboard` | Bookings, requests, orders, leads, anything moving through statuses | `app` | localStorage, multi-tab sync, validated add form. |
| `/report` | Reports, quotes, invoices, summaries, AI extraction output | `doc` (`DocContent`) | Blocks in order: `heading`, `text`, `tiles`, `table`, `callout`, `list`. Optional `sources` shows a "Built from these files" panel. Save as PDF uses the browser print dialog; the print CSS in `globals.css` hides everything marked `data-noprint` and keeps colours exact. Needs a block the six types do not cover (photo cards, charts)? Write a page next to it, as `jobs/real-estate-rental/site/app/report` did. |
| `/assistant` | Chatbots, AI assistants, support bots, RAG pitches | `chat` (`ChatContent`) | Keyword replies (`pickReply`), typing dots, word-by-word streaming, suggestion chips, side panel `notes` on how the real one works. No API call, so no key ever ships to the browser. |

For a real chatbot after the job is won, replace `pickReply` with a route handler that calls the Claude or OpenAI API on the server (key in env, rate limit, input length cap), and keep `validateMessage` on both sides.

## Motion styles

One setting changes how the whole demo moves, so demos for different clients do not feel like the same template. It drives `Reveal`, `SplitWords`, the page transition (`app/template.tsx`) and the preloader exit. Definitions in `lib/motion-styles.ts`.

| `motion` | Feel | Scroll reveal | Page change | Preloader exit | Sector default |
|---|---|---|---|---|---|
| silk | Calm, premium | Lift and un-blur, soft spring | Rise and un-blur | Curtain columns rise in a wave | health, professional |
| snap | Fast, precise | Short rise, quick tween | Slide in from the side | One panel wipes up | saas, retail, logistics |
| editorial | Magazine | Mask opens from the bottom (clip-path, removed when done) | Long lift, expo ease | Horizontal blinds fold up | creative, property |
| pop | Playful | Scale up with a bouncy spring | Small zoom in | Circle closes to the centre | food, education, events |

Set `motion` in `site.config.ts` when the brand feels different from its sector, for example `silk` for a luxury `retail` shop. Reduced motion always gets a plain fade. Tune a style in `STYLES`; `lib/motion-styles.test.ts` keeps every style distinct and every one in use.

## Motion kit

Import from `@/components/motion`. Every piece respects reduced motion through `MotionConfig` in `Providers`.

| Component | What it does | Use for |
|---|---|---|
| `Reveal` | Brings a block in once in view, in the motion style. `delay={i * 0.08}` to stagger, `y` to change the travel. | Any block |
| `SplitWords` / `SplitChars` | Words (in the motion style) or letters rise out of a mask. `accents` styles exact words. `play` gates it. | Headlines |
| `Magnetic` | Child drifts towards the cursor. | Primary CTA |
| `ArrowLink` | Pill link, arrow in its own circle slides out and back in. `tone` ink/canvas/accent. | Buttons |
| `Shell` / `Eyebrow` | Double-bezel card / small uppercase pill. | Cards, section labels |
| `VelocityMarquee` | Band that speeds up with scroll and flips direction on scroll up. | Tilted band |
| `SpinBadge` | Round sticker, text around the edge, spins faster on scroll. Fits any text to the ring (shrinks or spaces it out); keep `hero.badge` ≤ 46 characters so it stays readable. | Hero accent |
| `ParallaxStack` | Three visuals dealt like cards, then drifting at different speeds. | Hero visual |
| `HorizontalRail` | Pins and scrolls sideways on desktop, swipe row with snap on mobile. | Work, menu, listings |
| `StickyStack` | Cards pin on top of each other, the ones below shrink and dim. | Steps, case studies |
| `TextScrub` | Paragraph words light up as it scrolls through. | Statement |
| `ClipReveal` | Visual opens from a small window to full width, content rises last. | Closing CTA |
| `CountUp` | Counts to `to` once in view, keeps decimals, `prefix`/`suffix`. | Stats |
| `TiltCard` | 3D tilt towards the cursor with a soft light. | Bento cards |
| `ScrollProgress` | Accent bar across the top. Already in the layout. | |

Other building blocks:

* `Preloader`: once per tab. Photos stack in a frame, the brand rises letter by letter, a counter runs to 100, then two layers leave in the motion style's exit. Settings live in `SITE.preloader`. Hero motion waits for `useIntroDone()`, which turns true as the exit starts, so the two overlap.
* `Media` renders a preset `Visual`: the photo if set, otherwise an `ArtPanel` drawn in theme colours (four compositions via `variant`, `bare` drops the centre icon for use behind text). Parent needs a size and `relative`.
* `Icon name="..."`: add new Phosphor icons to the map in `components/Icon.tsx` (import from `@phosphor-icons/react/dist/ssr`). No emoji as icons.
* `Shell` puts `h-full` on its inner core, so a fixed height (`h-[560px]`) belongs on `className` (the outer ring), not on `inner`, or `h-full` wins and the box grows with its content.
* `Logo`: SVG tile with the initial plus the name and an italic accent word.
* `useToast()`: `toast("Saved")` or `toast("Check the form", "info")`.
* Demo store (`lib/demo-store.ts`): `getDemoStore(key, seed, isValid)` plus `useDemoStore(store)`. localStorage with shape validation, multi-tab sync through the `storage` event, falls back to memory when storage is blocked. The footer's Reset button calls `resetDemoData(prefix)`.
* `validateDraft` (`lib/board.ts`): trim, collapse spaces, length limits, field-level error. The form shows it inline with `role="alert"` and focuses the field.
* `formatTime` / `formatDate` (`lib/format.ts`): always pass `SITE.locale` and `SITE.timeZone`.

## Rules that already cost us a bug

* Props from server to client components must be serialisable. Pass data, never functions or components.
* Pin the timezone in every date format. Server (UTC on Vercel) and browser disagree otherwise and React throws hydration error #418.
* Pin it to a zone with stable rules (`America/New_York`, the default, `Europe/London` or `UTC`), not just any client city. Zones whose rules changed recently format differently in Node and Chrome: `Africa/Casablanca` gave 09:00 in Node (tzdata 2026c) and 10:00 in Chromium for the same instant, which is #418 again.
* No synchronous `setState` inside `useEffect`. Derive the value, or use `useSyncExternalStore` for browser state.
* Never run `next build` while `next dev` runs in the same folder: it corrupts `.next`. `check.sh` refuses to start if it sees one.
* Test the production build (`next start`, `TZ=UTC`), not only dev. Turbopack dev can serve stale CSS (`rm -rf .next/dev` and restart).
* Grids need `grid-cols-1` below their breakpoint. Without it a scrollable child (tabs, rails) widens the implicit column and the page overflows at 390px.
* In word-split text the space must sit outside the inline-block span, or words glue together.
* An absolutely positioned `-z-10` pill (motion `layoutId`) needs `isolate` on its parent, or it slides behind the card background.
* Stop servers with `fuser -k 3299/tcp`. `pkill -f` patterns can match your own shell.

## Photos

```bash
python3 -I scripts/photos.py "farmers market stall" 3 --prefix market
```

Searches Openverse for CC0 and public domain images only (anonymous API: 20 results per page, so it pages up to three times; asking for more than 20 per page returns 401), downloads into a temp folder (https, image types, 15 MB cap), re-encodes to JPEG at most 1280px wide into `public/photos/<prefix>-<n>.jpg`, runs `clean-media --in-place` on each file and appends the credit to `public/photos/credits.json`. Look at every photo before using it: no faces in close-up, no visible brand logos, nothing that contradicts the copy. Remove photos and credits you do not use.

## Check and screenshots

```bash
npm run check                      # typecheck, lint, unit tests, TZ=UTC build, next start, browser smoke test
python3 scripts/shot.py / 1440 home --full --intro   # needs a server on :3299 (BASE env to change)
```

The smoke test walks every prerendered route at 1440px in a browser set to Asia/Jakarta (server in UTC), scrolls each page, fails on page errors, console errors, a preloader that does not clear and horizontal overflow at 390px (it names the element that sticks out). On the flow routes that still exist it also checks the board form (validates, adds a row), the chat (validates, streams a reply to a suggestion) and the print layout of `/report` (site chrome hidden, document visible). `shot.py` scrolls before every shot so CountUp numbers are filled in. Downscale big screenshots to about 1280px before reading them.

## Deploy and clean up

```bash
npx vercel@latest project create <slug>-demo                # once; otherwise the project is named after the folder ("site")
npx vercel@latest link --yes --project <slug>-demo
npx vercel@latest deploy --prod --yes
npx vercel@latest project rm <name> --confirm-name <name>   # when the job is lost or cancelled
```

Keep `vercel.json` (`"framework": "nextjs"`). A project made with `project create` has no framework preset, and without the pin Vercel serves only `public/`: every page is a 404 while the build still says Ready. After deploying, check that `/` and every flow route you kept return 200 and run `python3 scripts/smoke.py https://<slug>-demo.vercel.app`.

Open the live URL on a phone-sized viewport before putting it in a cover letter. Delete the Vercel project and note `batal` in `applied.md` when a demo is no longer needed.

## When the demo wins the job

The contract side (scope, funded milestone first, content rules, QA, submit, review) follows upwork `jobs/PROSEDUR.md`. This list covers the code.

1. Start only after the milestone is funded. `site/` becomes the client's own private repo (`git init`, check it is private before the first push). Client work never goes into `andrych17/demo-starter`.
2. Swap in the client's material: brand, logo, photos and their real text. Their wording is not rewritten (PROSEDUR §3). Delete CC0 photos and credits that are no longer used.
3. Turn the demo into a real site:
   * `app/layout.tsx`: remove `robots: { index: false, follow: false }` (the demo is noindex on purpose) and point `metadataBase` at the client's domain.
   * `site.config.ts`: replace `footerNote` with the client's line. Remove `<ResetDemo>` from `components/SiteFooter.tsx`.
   * `/dashboard`: the demo store lives in one browser only. If the client needs real data, replace `getDemoStore` with a backend (route handlers or NestJS, Postgres with Prisma, or Supabase) and validate on the server too; `validateDraft` can stay for the form. If they do not need it, delete the route and its nav and CTA links.
   * Preloader: ask the client. `SITE.preloader.enabled = false`, or lower `minMs`.
   * Unused sector presets can stay. They are only read on the server and do not ship to the browser.
4. Finish the SEO items in PROSEDUR §4.3. The starter only has title, description and the icon: add the Open Graph image, `sitemap.ts`, `robots.ts`, JSON-LD and `llms.txt`.
5. `npm run check`, then the PROSEDUR §4 checks on the live URL (Lighthouse, layout at 375/768/1024/1440, the real form end to end).
6. Hosting: Vercel works as it is. cPanel needs a static export (`output: "export"` and `images: { unoptimized: true }` in `next.config.ts`, upload `out/`). That path is untested in this starter, and the security headers in `next.config.ts` do not apply to a static export (they would need `.htaccess`). Test it before promising cPanel to a client.
7. Once the real site is live, delete the demo deployment unless it is the same Vercel project.
8. Fixes that help every demo go back into `jobs/demo-starter` and get committed there.
