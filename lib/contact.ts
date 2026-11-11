import { CONTACT_TOPICS } from "./pangea.ts";

export type ContactDraft = { name: string; email: string; topic: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactDraft, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trims, collapses spaces in single-line fields and returns the cleaned draft with any field errors. */
export function validateContact(d: ContactDraft): { clean: ContactDraft; errors: ContactErrors } {
  const clean = { name: d.name.replace(/\s+/g, " ").trim(), email: d.email.trim(), topic: d.topic, message: d.message.trim() };
  const errors: ContactErrors = {};
  if (clean.name.length < 2 || clean.name.length > 80) errors.name = "Enter your name (2 to 80 characters).";
  if (!EMAIL.test(clean.email) || clean.email.length > 120) errors.email = "Enter a valid email address.";
  if (!(CONTACT_TOPICS as readonly string[]).includes(clean.topic)) errors.topic = "Choose a topic.";
  if (clean.message.length < 10 || clean.message.length > 2000) errors.message = "Write 10 to 2000 characters.";
  return { clean, errors };
}
