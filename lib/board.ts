/** Pure logic for the example app page: records moving through three statuses. Tested in board.test.ts. */
export type Status = 0 | 1 | 2;
export type Item = { id: string; title: string; meta: string; status: Status; createdAt?: number };

export const LIMITS = { title: { min: 2, max: 80 }, meta: { min: 2, max: 60 } } as const;

export function seedItems(seed: { title: string; meta: string; status: Status }[]): Item[] {
  return seed.map((s, i) => ({ id: `seed-${i}`, ...s }));
}

/** 0 → 1 → 2, then back to 0 (reopen). */
export function nextStatus(s: Status): Status {
  return s === 2 ? 0 : ((s + 1) as Status);
}

export function countByStatus(items: Item[]): [number, number, number] {
  const c: [number, number, number] = [0, 0, 0];
  for (const i of items) c[i.status] += 1;
  return c;
}

type Draft = { ok: true; title: string; meta: string } | { ok: false; field: "title" | "meta"; error: string };

export function validateDraft(title: string, meta: string, labels: { title: string; meta: string }): Draft {
  const t = title.trim().replace(/\s+/g, " ");
  const m = meta.trim().replace(/\s+/g, " ");
  if (t.length < LIMITS.title.min) return { ok: false, field: "title", error: `${labels.title} needs at least ${LIMITS.title.min} characters.` };
  if (t.length > LIMITS.title.max) return { ok: false, field: "title", error: `${labels.title} can be ${LIMITS.title.max} characters at most.` };
  if (m.length < LIMITS.meta.min) return { ok: false, field: "meta", error: `${labels.meta} needs at least ${LIMITS.meta.min} characters.` };
  if (m.length > LIMITS.meta.max) return { ok: false, field: "meta", error: `${labels.meta} can be ${LIMITS.meta.max} characters at most.` };
  return { ok: true, title: t, meta: m };
}

/** Shape check for data read back from localStorage. */
export function isItemList(v: unknown): v is Item[] {
  return (
    Array.isArray(v) &&
    v.length <= 500 &&
    v.every(
      (i) =>
        typeof i === "object" &&
        i !== null &&
        typeof i.id === "string" &&
        typeof i.title === "string" &&
        typeof i.meta === "string" &&
        (i.status === 0 || i.status === 1 || i.status === 2) &&
        (i.createdAt === undefined || typeof i.createdAt === "number"),
    )
  );
}
