// Loads the built-in website content into Supabase.
//   npm run db:seed            fills only empty tables (safe to re-run)
//   npm run db:seed -- --force replaces ALL content with the built-in version (keeps users, inbox, media)
import { createClient } from '@supabase/supabase-js';
import { seedClients, seedFaqs, seedIndustries, seedPartners, seedProducts, seedPublications, seedSettings } from '../src/content/seed';
import { fromClient, fromFaq, fromIndustry, fromPartner, fromProduct, fromPublication } from '../src/lib/mappers';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.');
  process.exit(1);
}
const force = process.argv.includes('--force');
const db = createClient(url, key, { auth: { persistSession: false } });

async function seedTable(table: string, rows: Record<string, unknown>[]) {
  const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(`${table}: ${error.message}. Did you run the SQL migration?`);
  if (count && !force) {
    console.log(`  ${table.padEnd(13)} skipped (already has ${count} rows)`);
    return;
  }
  if (count && force) {
    const del = await db.from(table).delete().not('id', 'is', null);
    if (del.error) throw new Error(`${table}: ${del.error.message}`);
  }
  const ins = await db.from(table).insert(rows);
  if (ins.error) throw new Error(`${table}: ${ins.error.message}`);
  console.log(`  ${table.padEnd(13)} ${rows.length} rows`);
}

async function main() {
  console.log(`Seeding ${url}${force ? ' (force: replacing content)' : ''}`);

  const existing = await db.from('settings').select('key').eq('key', 'site').maybeSingle();
  if (existing.error) throw new Error(`settings: ${existing.error.message}. Did you run the SQL migration?`);
  if (!existing.data || force) {
    const up = await db.from('settings').upsert({ key: 'site', value: seedSettings });
    if (up.error) throw new Error(`settings: ${up.error.message}`);
    console.log('  settings      saved');
  } else console.log('  settings      skipped (already set)');

  await seedTable('products', seedProducts.map(fromProduct));
  await seedTable('industries', seedIndustries.map(fromIndustry));
  await seedTable('partners', seedPartners.map(fromPartner));
  await seedTable('clients', seedClients.map(fromClient));
  await seedTable('faqs', seedFaqs.map(fromFaq));
  await seedTable('publications', seedPublications.map(fromPublication));
  console.log('Done. Restart the site (or save anything in /admin) to see database content.');
}

main().catch(err => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
