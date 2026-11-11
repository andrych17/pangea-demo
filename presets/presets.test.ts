import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { SECTORS } from "../site.config.ts";
import { FONT_PAIRINGS, THEMES } from "../lib/themes.ts";
import { PRESETS } from "./index.ts";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const words = (s: string) => s.split(" ");

test("every sector has a preset and the keys match", () => {
  assert.deepEqual(Object.keys(PRESETS).sort(), [...SECTORS].sort());
  for (const [key, p] of Object.entries(PRESETS)) assert.equal(p.sector, key);
});

for (const [key, p] of Object.entries(PRESETS)) {
  test(`${key}: theme, fonts and palette block exist`, () => {
    assert.ok(p.theme in THEMES, `unknown theme ${p.theme}`);
    assert.ok(p.fonts in FONT_PAIRINGS, `unknown fonts ${p.fonts}`);
    if (p.theme !== "ember") assert.ok(css.includes(`html[data-theme="${p.theme}"]`), `globals.css has no block for ${p.theme}`);
  });

  test(`${key}: accent words appear exactly in their text`, () => {
    for (const w of p.home.hero.accentWords) assert.ok(words(p.home.hero.title).includes(w), `hero accent "${w}" not in title`);
    for (const w of p.home.statement.accentWords) assert.ok(words(p.home.statement.text).includes(w), `statement accent "${w}" not in text`);
  });

  test(`${key}: photos exist in public/`, () => {
    const visuals = [...p.home.hero.visuals, ...p.home.showcase.cards.map((c) => c.visual), p.home.cta.visual];
    for (const v of visuals) if (v.photo) assert.ok(existsSync(new URL(`../public${v.photo}`, import.meta.url)), `missing ${v.photo}`);
  });

  test(`${key}: sections have enough content for the layout`, () => {
    assert.equal(p.home.features.items.length, 4);
    assert.ok(p.home.showcase.cards.length >= 4, "rail needs 4+ cards");
    assert.ok(p.home.steps.items.length >= 3 && p.home.steps.items.length <= 5);
    assert.ok(p.home.hero.stats.length === 3);
    assert.ok(p.app.seed.length >= 4);
    assert.ok(p.home.hero.badge.endsWith(" • "), "badge should end with ' • ' so the ring loops cleanly");
    // SpinBadge shrinks long text to fit the ring; past ~46 characters it gets too small to read on a phone.
    assert.ok(p.home.hero.badge.length <= 46, `badge is ${p.home.hero.badge.length} characters, keep it to 46`);
  });
}
