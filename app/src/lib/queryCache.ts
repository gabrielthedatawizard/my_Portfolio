/**
 * Tiny TTL cache for Supabase reads.
 *
 * Public portfolio content barely changes but is fetched on every mount —
 * this gives instant repeat views and dedupes concurrent identical requests.
 * Entries live 60s and are invalidated per-table on realtime events.
 * Cleared on sign-out so admin-only data never lingers for the next browser user.
 */

const TTL_MS = 60_000;

type Entry = { ts: number; data: unknown[] };

const cache = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown[]>>();

export const readQueryCache = (key: string): unknown[] | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

export const writeQueryCache = (key: string, data: unknown[]): void => {
  cache.set(key, { ts: Date.now(), data });
};

export const getInflightQuery = <T>(key: string): Promise<T[]> | null => {
  return (inflight.get(key) as Promise<T[]> | undefined) ?? null;
};

export const setInflightQuery = (key: string, promise: Promise<unknown[]>): void => {
  inflight.set(key, promise);
};

export const clearInflightQuery = (key: string): void => {
  inflight.delete(key);
};

/** Drop all cached reads for one table (called on realtime change events). */
export const invalidateTableCache = (table: string): void => {
  const prefix = `${table}|`;
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};

/** Drop everything (called on sign-out). */
export const clearQueryCache = (): void => {
  cache.clear();
  inflight.clear();
};
