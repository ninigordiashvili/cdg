import 'server-only';
import { db } from './db';

export type EventRow = {
  id: number;
  date: string; // YYYY-MM-DD
  location: string;
  titleGe: string;
  titleEn: string;
  textGe: string;
  textEn: string;
  published: boolean;
};

export type EventInput = Omit<EventRow, 'id'>;

const toEvent = (r: Record<string, unknown>): EventRow => ({
  id: Number(r.id),
  date: String(r.date),
  location: String(r.location),
  titleGe: String(r.title_ge),
  titleEn: String(r.title_en),
  textGe: String(r.text_ge),
  textEn: String(r.text_en),
  published: Number(r.published) === 1,
});

export async function listEvents(opts: { onlyPublished?: boolean } = {}): Promise<EventRow[]> {
  const c = await db();
  const res = await c.execute(
    `SELECT * FROM events ${opts.onlyPublished ? 'WHERE published = 1' : ''} ORDER BY date DESC, id DESC`
  );
  return res.rows.map(toEvent);
}

/** Public site: never throws, so a database problem cannot take the page down. */
export async function listPublicEvents(): Promise<EventRow[]> {
  try {
    return await listEvents({ onlyPublished: true });
  } catch (e) {
    console.error('Could not load events.', e);
    return [];
  }
}

export async function getEvent(id: number): Promise<EventRow | undefined> {
  const c = await db();
  const res = await c.execute({ sql: 'SELECT * FROM events WHERE id = ?', args: [id] });
  return res.rows[0] ? toEvent(res.rows[0]) : undefined;
}

export async function saveEvent(id: number | undefined, e: EventInput) {
  const c = await db();
  const args = [e.date, e.location, e.titleGe, e.titleEn, e.textGe, e.textEn, e.published ? 1 : 0];
  if (id) {
    await c.execute({
      sql: `UPDATE events SET date = ?, location = ?, title_ge = ?, title_en = ?, text_ge = ?,
            text_en = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [...args, id],
    });
  } else {
    await c.execute({
      sql: `INSERT INTO events (date, location, title_ge, title_en, text_ge, text_en, published)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args,
    });
  }
}

export async function deleteEvent(id: number) {
  const c = await db();
  await c.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [id] });
}
