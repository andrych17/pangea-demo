import { test } from "node:test";
import assert from "node:assert/strict";
import { countByStatus, isItemList, nextStatus, seedItems, validateDraft } from "./board.ts";

const labels = { title: "Request", meta: "Client" };

test("status advances and wraps back to the first one", () => {
  assert.equal(nextStatus(0), 1);
  assert.equal(nextStatus(1), 2);
  assert.equal(nextStatus(2), 0);
});

test("seed items get stable ids and counts add up", () => {
  const items = seedItems([{ title: "A", meta: "x", status: 0 }, { title: "B", meta: "y", status: 2 }, { title: "C", meta: "z", status: 2 }]);
  assert.deepEqual(items.map((i) => i.id), ["seed-0", "seed-1", "seed-2"]);
  assert.deepEqual(countByStatus(items), [1, 0, 2]);
});

test("draft is trimmed and inner whitespace collapsed", () => {
  assert.deepEqual(validateDraft("  Brand   refresh ", " Kite  Bikes ", labels), { ok: true, title: "Brand refresh", meta: "Kite Bikes" });
});

test("draft rejects short and long fields with the field name", () => {
  const short = validateDraft(" a ", "Kite", labels);
  assert.equal(short.ok, false);
  assert.equal(!short.ok && short.field, "title");
  const long = validateDraft("Brand refresh", "x".repeat(61), labels);
  assert.equal(!long.ok && long.field, "meta");
  assert.match(!long.ok ? long.error : "", /^Client can be 60/);
});

test("stored list validation rejects tampered data", () => {
  assert.equal(isItemList([{ id: "1", title: "a", meta: "b", status: 1 }]), true);
  assert.equal(isItemList([{ id: "1", title: "a", meta: "b", status: 7 }]), false);
  assert.equal(isItemList([{ id: 1, title: "a", meta: "b", status: 1 }]), false);
  assert.equal(isItemList({}), false);
});
