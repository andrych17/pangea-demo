import { test } from "node:test";
import assert from "node:assert/strict";
import { readStored } from "./storage.ts";

const isNums = (v: unknown): v is number[] => Array.isArray(v) && v.every((n) => typeof n === "number");

test("returns the fallback when nothing is stored", () => {
  assert.deepEqual(readStored(null, [1], isNums), [1]);
});

test("returns the fallback for corrupt JSON instead of throwing", () => {
  assert.deepEqual(readStored("{not json", [1], isNums), [1]);
});

test("returns the fallback when the stored shape is wrong", () => {
  assert.deepEqual(readStored('["a","b"]', [1], isNums), [1]);
});

test("returns the stored value when it is valid", () => {
  assert.deepEqual(readStored("[4,5]", [1], isNums), [4, 5]);
});
