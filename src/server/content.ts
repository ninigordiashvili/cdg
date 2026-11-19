import 'server-only';
import { cache } from 'react';
import { db } from './db';

export type Overrides = Record<string, string>;

/** Flattens a dictionary into `path.to.0.leaf` → string pairs. */
export function flatten(value: unknown, prefix = '', out: Overrides = {}): Overrides {
  if (typeof value === 'string') {
    out[prefix] = value;
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

/** Returns a copy of `dictionary` with every override applied to an existing string leaf. */
export function applyOverrides<T>(dictionary: T, overrides: Overrides): T {
  const copy = structuredClone(dictionary) as Record<string, unknown>;
  for (const [path, value] of Object.entries(overrides)) {
    const parts = path.split('.');
    let node: unknown = copy;
    for (const part of parts.slice(0, -1)) {
      node = (node as Record<string, unknown> | undefined)?.[part];
    }
    const last = parts[parts.length - 1];
    if (
      node &&
      typeof node === 'object' &&
      typeof (node as Record<string, unknown>)[last] === 'string'
    ) {
      (node as Record<string, unknown>)[last] = value;
    }
  }
  return copy as T;
}

/** Overrides for one language. Falls back to none if the database is unreachable. */
export const getOverrides = cache(async (lang: string): Promise<Overrides> => {
  try {
    const c = await db();
    const res = await c.execute({
      sql: 'SELECT key, value FROM content WHERE lang = ?',
      args: [lang],
    });
    return Object.fromEntries(res.rows.map((r) => [String(r.key), String(r.value)]));
  } catch (e) {
    console.error('Could not load content overrides; using built-in texts.', e);
    return {};
  }
});

export async function saveOverrides(
  lang: string,
  changes: { key: string; value: string | null }[],
  userEmail: string
) {
  if (!changes.length) return;
  const c = await db();
  await c.batch(
    changes.map(({ key, value }) =>
      value === null
        ? { sql: 'DELETE FROM content WHERE lang = ? AND key = ?', args: [lang, key] }
        : {
            sql: `INSERT INTO content (lang, key, value, updated_by) VALUES (?, ?, ?, ?)
                  ON CONFLICT(lang, key) DO UPDATE SET value = excluded.value,
                  updated_at = CURRENT_TIMESTAMP, updated_by = excluded.updated_by`,
            args: [lang, key, value, userEmail],
          }
    ),
    'write'
  );
}
