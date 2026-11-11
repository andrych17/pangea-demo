import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate, formatTime } from "./format.ts";

// 12:00 UTC on 15 Jan 2026. London is UTC+0 in winter, Jakarta UTC+7.
const instant = Date.UTC(2026, 0, 15, 12, 0);

test("time follows the pinned zone, not the machine zone", () => {
  assert.equal(formatTime(instant, "en-GB", "Europe/London"), "12:00");
  assert.equal(formatTime(instant, "en-GB", "Asia/Jakarta"), "19:00");
});

test("date can roll over to the next day in a far zone", () => {
  const late = Date.UTC(2026, 0, 15, 20, 0);
  assert.equal(formatDate(late, "en-GB", "Europe/London"), "15 Jan 2026");
  assert.equal(formatDate(late, "en-GB", "Asia/Jakarta"), "16 Jan 2026");
});
