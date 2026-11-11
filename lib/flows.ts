/**
 * Content and logic for the two optional flows: /report (printable document) and /assistant (scripted chat).
 * When a preset has no `doc` or `chat` block, these build one from the rest of the preset, so every sector
 * has a sensible default. Tested in flows.test.ts.
 */
import type { ChatContent, DocContent, Preset } from "./content.ts";

const fullName = (p: Preset): string => (p.brand.accent ? `${p.brand.name} ${p.brand.accent}` : p.brand.name);

/** Lowercase, punctuation to spaces, single spaces. Used on both questions and keywords. */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

/** A summary of the /dashboard records: counts per status, the record table, then the preset's features. */
export function docFromPreset(p: Preset): DocContent {
  const counts = [0, 0, 0];
  for (const s of p.app.seed) counts[s.status] += 1;
  return {
    title: `${p.app.title} summary`,
    intro: "A printable summary built from the same records as the app page. Save it as PDF with the button.",
    doc: {
      kicker: "Weekly summary",
      title: p.app.title,
      subtitle: fullName(p),
      meta: "Prepared from demo data",
      blocks: [
        { type: "tiles", items: [...p.app.statuses.map((label, i) => ({ label, value: String(counts[i]) })), { label: `All ${p.app.plural.toLowerCase()}`, value: String(p.app.seed.length), dark: true }] },
        { type: "heading", text: p.app.plural },
        { type: "table", columns: [p.app.singular, p.app.metaLabel, "Status"], rows: p.app.seed.map((s) => [s.title, s.meta, p.app.statuses[s.status]]) },
        { type: "callout", title: `${p.home.cta.title} ${p.home.cta.accent}`, body: p.home.cta.body },
        { type: "heading", text: p.home.features.title },
        { type: "list", items: p.home.features.items.map((f) => ({ title: f.title, body: f.body })) },
      ],
      footer: "Demo document. Names and numbers are made up.",
    },
  };
}

/** An assistant that answers from the homepage copy: one reply per feature, one for the steps, one for the call to action. */
export function chatFromPreset(p: Preset): ChatContent {
  const name = fullName(p);
  const features = p.home.features.items;
  const stat = (f: (typeof features)[number]) => (f.stat ? ` ${f.stat.prefix ?? ""}${f.stat.value}${f.stat.suffix ?? ""} ${f.stat.label}.` : "");
  const steps = p.home.steps.items.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join(" ");
  return {
    title: `Ask ${name}`,
    intro: "A scripted assistant. It answers from this site's own copy, the way a real one would answer from your documents.",
    assistant: `${name} assistant`,
    greeting: `Hello, I'm the ${name} assistant. ${p.brand.tagline} What would you like to know?`,
    suggestions: [...features.slice(0, 2).map((f) => `Tell me about ${f.title.toLowerCase()}`), "How does it work?"],
    replies: [
      ...features.map((f) => ({ keywords: [normalize(f.title), ...normalize(f.title).split(" ").filter((w) => w.length > 3)], answer: `${f.body}${stat(f)}` })),
      { keywords: ["how does it work", "how", "process", "steps", "work"], answer: `${p.home.steps.title} ${steps}` },
      { keywords: ["price", "cost", "contact", "book", "start", ...normalize(p.cta.label).split(" ").filter((w) => w.length > 3)], answer: `${p.home.cta.body} The quickest way in is "${p.cta.label}" at the top of the page.` },
    ],
    fallback: `I can only answer from this demo's content for now. Try asking about ${features.map((f) => f.title.toLowerCase()).join(", ")}.`,
    notes: [
      "Scripted for this demo: answers come from the site's own copy, no AI call.",
      "A real version answers from your documents through the Claude or OpenAI API.",
      "Questions it cannot answer go to a person, with the chat attached.",
    ],
  };
}

/** Best reply by keyword overlap (a multi-word keyword counts once per word). No match returns the fallback. */
export function pickReply(text: string, replies: ChatContent["replies"], fallback: string): string {
  const q = ` ${normalize(text)} `;
  let best = { score: 0, answer: fallback };
  for (const r of replies) {
    const score = r.keywords.reduce((sum, k) => {
      const key = normalize(k);
      return key && q.includes(` ${key} `) ? sum + key.split(" ").length : sum;
    }, 0);
    if (score > best.score) best = { score, answer: r.answer };
  }
  return best.answer;
}

export const MESSAGE_MAX = 400;

export function validateMessage(text: string): { ok: true; text: string } | { ok: false; error: string } {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return { ok: false, error: "Type a question first." };
  if (t.length > MESSAGE_MAX) return { ok: false, error: `Keep it under ${MESSAGE_MAX} characters.` };
  return { ok: true, text: t };
}
