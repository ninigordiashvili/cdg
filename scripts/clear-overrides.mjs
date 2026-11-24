// Removes admin overrides for the texts the client has updated in the dictionary files,
// so the approved text in src/dictionary/*.json is what visitors see.
// Dry run by default. Pass --apply to actually delete rows.
// Usage: npm run clear-overrides            (lists what would be removed)
//        npm run clear-overrides -- --apply (deletes them)
import { db } from '../src/server/db.ts';

// Key prefixes (flattened dictionary paths) the client changed.
const PREFIXES = [
  'cdg.',
  'autism.',
  'rare.lead',
  'beneficiary.',
  'events.lead',
  'events.follow',
  'home.stats',
  'common.medicalNote',
  'common.helpTitle',
  'common.helpText',
];

const apply = process.argv.includes('--apply');
const client = await db();

const { rows } = await client.execute({ sql: 'SELECT lang, key, value FROM content ORDER BY lang, key' });
const matches = rows.filter((r) => PREFIXES.some((p) => String(r.key).startsWith(p)));

if (!matches.length) {
  console.log('No matching admin overrides found.');
} else {
  for (const r of matches) console.log(`${r.lang}  ${r.key}  =>  ${String(r.value).slice(0, 70)}`);
  if (apply) {
    await client.batch(
      matches.map((r) => ({
        sql: 'DELETE FROM content WHERE lang = ? AND key = ?',
        args: [r.lang, r.key],
      })),
      'write'
    );
    console.log(`Removed ${matches.length} override(s).`);
  } else {
    console.log(`\nDry run: ${matches.length} override(s) would be removed. Re-run with --apply.`);
  }
}
process.exit(0);
