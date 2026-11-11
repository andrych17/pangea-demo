import { test } from "node:test";
import assert from "node:assert/strict";
import { PRESETS } from "../presets/index.ts";
import { chatFromPreset, docFromPreset, MESSAGE_MAX, pickReply, validateMessage } from "./flows.ts";

const replies = [
  { keywords: ["opening hours", "open"], answer: "hours" },
  { keywords: ["price", "cost"], answer: "price" },
];

test("pickReply matches whole words, prefers the reply with more matching words", () => {
  assert.equal(pickReply("What are your opening hours?", replies, "fallback"), "hours");
  assert.equal(pickReply("How much does it COST", replies, "fallback"), "price");
  assert.equal(pickReply("Is it opened yet", replies, "fallback"), "fallback"); // "open" is not a substring match
  assert.equal(pickReply("", replies, "fallback"), "fallback");
});

test("validateMessage trims, collapses spaces and caps the length", () => {
  assert.deepEqual(validateMessage("  hi   there "), { ok: true, text: "hi there" });
  assert.equal(validateMessage("   ").ok, false);
  assert.equal(validateMessage("x".repeat(MESSAGE_MAX + 1)).ok, false);
});

for (const [key, p] of Object.entries(PRESETS)) {
  test(`${key}: default chat answers every suggestion without falling back`, () => {
    const chat = p.chat ?? chatFromPreset(p);
    assert.ok(chat.suggestions.length >= 2);
    for (const s of chat.suggestions) assert.notEqual(pickReply(s, chat.replies, chat.fallback), chat.fallback, `"${s}" fell back`);
  });

  test(`${key}: default document has a table whose rows match its columns`, () => {
    const doc = (p.doc ?? docFromPreset(p)).doc;
    const tables = doc.blocks.filter((b) => b.type === "table");
    assert.ok(tables.length >= 1);
    for (const t of tables) for (const row of t.rows) assert.equal(row.length, t.columns.length);
  });
}
