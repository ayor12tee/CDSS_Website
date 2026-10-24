// Pushes edits made to src/content/seed.ts into an already-seeded Supabase database, field by field.
//   npm run db:sync            preview: lists every field that would change, writes nothing
//   npm run db:sync -- --apply writes those changes
// Unlike `db:seed -- --force`, it never deletes rows and never touches content that only exists in the
// database (clients or settings added in /admin). Rows are matched by slug (products, industries,
// publications), by sort order (partners and FAQs, so a renamed partner updates in place) and by name
// (clients, insert-only). Only the settings keys in SYNC_SETTINGS are updated.
import { createClient } from '@supabase/supabase-js';
import { seedClients, seedFaqs, seedIndustries, seedPartners, seedProducts, seedPublications, seedSettings } from '../src/content/seed';
import { fromClient, fromFaq, fromIndustry, fromPartner, fromProduct, fromPublication } from '../src/lib/mappers';

const SYNC_SETTINGS = ['otherLines'] as const;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.');
  process.exit(1);
}
const apply = process.argv.includes('--apply');
const db = createClient(url, key, { auth: { persistSession: false } });

type Row = Record<string, unknown>;
// order-insensitive for object keys, so JSONB columns that only differ in key order don't count as changes
const canon = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(canon) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, canon(x)])) : (v ?? null);
const same = (a: unknown, b: unknown) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const preview = (v: unknown) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > 90 ? s.slice(0, 87) + '...' : s;
};

let changes = 0;

async function syncTable(table: string, rows: Row[], match: string, opts: { insertOnly?: boolean } = {}) {
  const { data, error } = await db.from(table).select('*');
  if (error) throw new Error(`${table}: ${error.message}`);
  for (const row of rows) {
    const label = `${table}/${String(row.slug ?? row.name ?? row.question ?? row[match])}`;
    const existing = data.find(d => d[match] === row[match]);
    if (!existing) {
      changes++;
      console.log(`  + ${label} (new row)`);
      if (apply) {
        const ins = await db.from(table).insert(row);
        if (ins.error) throw new Error(`${label}: ${ins.error.message}`);
      }
      continue;
    }
    if (opts.insertOnly) continue;
    const diff = Object.keys(row).filter(k => !same(row[k], existing[k]));
    if (!diff.length) continue;
    changes += diff.length;
    console.log(`  ~ ${label}`);
    for (const k of diff) console.log(`      ${k}: ${preview(existing[k])}\n      ${' '.repeat(k.length)}  → ${preview(row[k])}`);
    if (apply) {
      const up = await db
        .from(table)
        .update(Object.fromEntries(diff.map(k => [k, row[k]])))
        .eq('id', existing.id);
      if (up.error) throw new Error(`${label}: ${up.error.message}`);
    }
  }
}

async function main() {
  console.log(`${apply ? 'Applying' : 'Previewing'} content sync to ${url}\n`);

  const { data: settings, error } = await db.from('settings').select('value').eq('key', 'site').single();
  if (error) throw new Error(`settings: ${error.message}`);
  const changed = SYNC_SETTINGS.filter(k => !same(settings.value[k], seedSettings[k]));
  for (const k of changed) {
    changes++;
    console.log(`  ~ settings.${k}\n      ${preview(settings.value[k])}\n      → ${preview(seedSettings[k])}`);
  }
  if (apply && changed.length) {
    const next = { ...settings.value, ...Object.fromEntries(changed.map(k => [k, seedSettings[k]])) };
    const up = await db.from('settings').update({ value: next, updated_at: new Date().toISOString() }).eq('key', 'site');
    if (up.error) throw new Error(`settings: ${up.error.message}`);
  }

  await syncTable('products', seedProducts.map(fromProduct), 'slug');
  await syncTable('industries', seedIndustries.map(fromIndustry), 'slug');
  await syncTable('partners', seedPartners.map(fromPartner), 'sort_order');
  await syncTable('clients', seedClients.map(fromClient), 'name', { insertOnly: true });
  await syncTable('faqs', seedFaqs.map(fromFaq), 'sort_order');
  await syncTable('publications', seedPublications.map(fromPublication), 'slug');

  if (!changes) console.log('Database already matches seed.ts.');
  else if (apply) console.log(`\nDone: ${changes} change(s) written. Pages refresh on their next request.`);
  else console.log(`\n${changes} change(s) found. Run \`npm run db:sync -- --apply\` to write them.`);
}

main().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
