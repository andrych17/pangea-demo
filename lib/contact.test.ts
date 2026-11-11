import assert from "node:assert/strict";
import { test } from "node:test";
import { validateContact } from "./contact.ts";

const ok = { name: "  Ana   Lima ", email: "ana@example.com", topic: "General enquiry", message: "Hello, I would like to list my clinic." };

test("accepts a valid message and cleans spaces", () => {
  const { clean, errors } = validateContact(ok);
  assert.deepEqual(errors, {});
  assert.equal(clean.name, "Ana Lima");
});

test("flags every bad field", () => {
  const { errors } = validateContact({ name: "A", email: "nope", topic: "Spam", message: "short" });
  assert.deepEqual(Object.keys(errors).sort(), ["email", "message", "name", "topic"]);
});
