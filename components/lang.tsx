"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LANG, findLang, type Lang } from "@/lib/i18n";

// One language for the whole page, shared by the header select, the chip strip and the hero.
const KEY = "pangea-lang";
const listeners = new Set<() => void>();
let current: string | null = null;

function read(): string {
  if (current) return current;
  try {
    current = localStorage.getItem(KEY) ?? DEFAULT_LANG;
  } catch {
    current = DEFAULT_LANG;
  }
  apply(current);
  return current;
}

function apply(code: string) {
  const l = findLang(code);
  document.documentElement.lang = l.code;
  document.documentElement.dir = l.rtl ? "rtl" : "ltr";
}

export function setLang(code: string) {
  current = findLang(code).code;
  try {
    localStorage.setItem(KEY, current);
  } catch {}
  apply(current);
  listeners.forEach((l) => l());
}

/** Server and first client render use English, then the stored choice takes over (no hydration mismatch). */
export function useLang(): Lang {
  const code = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => DEFAULT_LANG,
  );
  return findLang(code);
}
