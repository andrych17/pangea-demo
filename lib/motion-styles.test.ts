import { test } from "node:test";
import assert from "node:assert/strict";
import { MOTION_STYLES, SECTORS } from "../site.config.ts";
import { SECTOR_MOTION, STYLES } from "./motion-styles.ts";

test("every sector has a motion style and every style is used by some sector", () => {
  for (const s of SECTORS) assert.ok(MOTION_STYLES.includes(SECTOR_MOTION[s]), `${s} has no valid style`);
  for (const m of MOTION_STYLES) assert.ok(Object.values(SECTOR_MOTION).includes(m), `${m} is never a sector default`);
});

test("each style starts hidden and ends visible, and the styles differ", () => {
  for (const [name, s] of Object.entries(STYLES)) {
    for (const part of [s.reveal, s.page]) {
      assert.equal(part.from.opacity, 0, `${name}: should start transparent`);
      assert.equal(part.to.opacity, 1, `${name}: should end opaque`);
    }
    assert.ok(s.words.stagger > 0 && s.words.stagger < 0.2, `${name}: word stagger out of range`);
  }
  assert.equal(new Set(Object.values(STYLES).map((s) => s.exit)).size, MOTION_STYLES.length, "two styles share a preloader exit");
  assert.equal(new Set(Object.values(STYLES).map((s) => JSON.stringify(s.page))).size, MOTION_STYLES.length, "two styles share a page transition");
});

test("a clip-path reveal removes the clip when done, so shadows and rails are not cut", () => {
  for (const [name, s] of Object.entries(STYLES)) {
    if ("clipPath" in s.reveal.to) assert.equal(s.reveal.to.transitionEnd?.clipPath, "none", `${name}: clip left on`);
  }
});
