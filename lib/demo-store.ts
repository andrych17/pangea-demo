import { useSyncExternalStore } from "react";
import { readStored } from "./storage.ts";

/**
 * Tiny localStorage store for demo data. No backend, survives reloads, and every open tab updates
 * through the `storage` event (open the app in two tabs to show a client "live" sync).
 * Server render and hydration use `seed`, so there is never a hydration mismatch.
 *
 *   const store = getDemoStore(`${storeKey}-items`, seed, isItemList);
 *   const items = useDemoStore(store);
 *   store.set((prev) => [...prev, item]);
 */
export type DemoStore<T> = {
  get: () => T;
  getSeed: () => T;
  set: (update: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
  reset: () => void;
};

const stores = new Map<string, DemoStore<unknown>>();

export function getDemoStore<T>(key: string, seed: T, isValid: (v: unknown) => v is T): DemoStore<T> {
  const existing = stores.get(key);
  if (existing) return existing as DemoStore<T>;

  let cache = seed;
  let loaded = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const get = () => {
    if (!loaded && typeof window !== "undefined") {
      loaded = true;
      try {
        cache = readStored(window.localStorage.getItem(key), seed, isValid);
      } catch {
        cache = seed; // Storage blocked (private mode, iframe): run in memory.
      }
    }
    return cache;
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== key) return;
    loaded = false;
    emit();
  };

  const store: DemoStore<T> = {
    get,
    getSeed: () => seed,
    set(update) {
      cache = update(get());
      try {
        window.localStorage.setItem(key, JSON.stringify(cache));
      } catch {
        // Quota or blocked storage: keep the in-memory value so the demo still works.
      }
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    reset() {
      cache = seed;
      loaded = true;
      emit();
    },
  };
  stores.set(key, store as DemoStore<unknown>);
  return store;
}

export function useDemoStore<T>(store: DemoStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getSeed);
}

/** Wipes every key under `prefix` (all stores of this demo) and resets the ones already in memory. */
export function resetDemoData(prefix: string) {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Storage blocked: nothing persisted anyway.
  }
  stores.forEach((s, key) => {
    if (key.startsWith(prefix)) s.reset();
  });
}
