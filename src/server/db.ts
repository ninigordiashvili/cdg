// libSQL: a local file in development, a hosted Turso database in production.
// Relative imports only — scripts/create-user.mjs loads this file directly with Node.
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createClient, type Client } from '@libsql/client';

let client: Client | undefined;
let ready: Promise<void> | undefined;

function getClient(): Client {
  const url = process.env.DATABASE_URL || 'file:./data/cdg.db';
  if (url.startsWith('file:')) mkdirSync(dirname(url.slice('file:'.length)), { recursive: true });
  client ??= createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  return client;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS content (
    lang TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT,
    PRIMARY KEY (lang, key)
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    title_ge TEXT NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    text_ge TEXT NOT NULL DEFAULT '',
    text_en TEXT NOT NULL DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

export async function db(): Promise<Client> {
  const c = getClient();
  ready ??= c.batch(SCHEMA, 'write').then(() => undefined);
  try {
    await ready;
  } catch (e) {
    ready = undefined;
    throw e;
  }
  return c;
}
