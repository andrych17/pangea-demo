/**
 * Parse a stored JSON value and fall back to `fallback` when it is missing, corrupt or the wrong shape.
 * Pure so it can be tested without a browser. Storage is user-editable, so never trust it unchecked.
 */
export function readStored<T>(raw: string | null, fallback: T, isValid: (v: unknown) => v is T): T {
  if (raw === null) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
