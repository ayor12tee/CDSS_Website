// Create (or reset) an admin dashboard account.
//   npm run user:create -- --email you@company.com --name "Your Name" --role admin
//   Add --password "..." to choose the password; otherwise a strong one is generated and printed once.
//   Running it again for an existing email resets that user's password, role AND two-factor
//   authentication (they scan a new QR code at next sign-in). Use this if the last admin is locked out.
import { createClient } from '@supabase/supabase-js';
import { generatePassword, hashPassword, passwordProblem } from '../src/lib/auth/password';

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.');

  const email = arg('email')?.trim().toLowerCase();
  const name = arg('name')?.trim() ?? '';
  const role = arg('role') ?? 'admin';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Pass a valid --email.');
  if (role !== 'admin' && role !== 'editor') throw new Error('--role must be admin or editor.');

  const password = arg('password') ?? generatePassword();
  const problem = passwordProblem(password);
  if (problem) throw new Error(`Password rejected: ${problem}`);

  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data: existing, error: findErr } = await db.from('users').select('id, session_version').eq('email', email).maybeSingle();
  if (findErr) throw new Error(`${findErr.message}. Did you run the SQL migration?`);

  const password_hash = await hashPassword(password);
  if (existing) {
    const { error } = await db
      .from('users')
      .update({
        password_hash,
        role,
        ...(name ? { name } : {}),
        session_version: existing.session_version + 1,
        totp_secret: null,
        totp_enabled_at: null,
        totp_last_step: 0,
        backup_codes: [],
      })
      .eq('id', existing.id);
    if (error) throw new Error(`${error.message}. Did you run every migration in supabase/migrations?`);
    console.log(`Updated ${email} (${role}). Sessions and two-factor authentication were reset.`);
  } else {
    const { error } = await db.from('users').insert({ email, name, role, password_hash });
    if (error) throw new Error(error.message);
    console.log(`Created ${email} (${role}).`);
  }
  if (!arg('password')) console.log(`Temporary password: ${password}`);
  console.log('Sign in at /admin/login. You will be asked to scan a QR code with your authenticator app.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
