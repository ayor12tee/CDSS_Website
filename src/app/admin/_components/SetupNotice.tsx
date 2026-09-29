import { isDbConfigured } from '@/lib/supabase';

export function setupProblems() {
  const problems: string[] = [];
  if (!isDbConfigured()) problems.push('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set.');
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) problems.push('AUTH_SECRET is missing or shorter than 32 characters.');
  const totpKey = process.env.TOTP_ENCRYPTION_KEY;
  if (!totpKey || totpKey.length < 32) problems.push('TOTP_ENCRYPTION_KEY is missing or shorter than 32 characters.');
  return problems;
}

/** Shown instead of the admin until the environment is configured. */
export function SetupNotice({ problems }: { problems: string[] }) {
  return (
    <div className="adm-login">
      <div className="adm-login-card" style={{ width: 'min(620px, 100%)' }}>
        <h1>Finish setting up the admin</h1>
        <p className="sub">The dashboard needs a Supabase database and a session secret before anyone can sign in.</p>
        <div className="adm-notice warn" style={{ marginBottom: 18 }}>
          <ul style={{ margin: 0 }}>
            {problems.map(p => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <ol style={{ display: 'grid', gap: 10, paddingLeft: 18, listStyle: 'decimal', fontSize: 14.5 }}>
          <li>
            Create a Supabase project and run the files in <code>supabase/migrations/</code> in its SQL editor, oldest first.
          </li>
          <li>
            Copy <code>.env.example</code> to <code>.env.local</code> and fill in <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>AUTH_SECRET</code> and{' '}
            <code>TOTP_ENCRYPTION_KEY</code>.
          </li>
          <li>
            Run <code>npm run db:seed</code> to load the current website content.
          </li>
          <li>
            Run <code>npm run user:create -- --email you@company.com --name &quot;Your Name&quot; --role admin</code>.
          </li>
          <li>Restart the server and sign in.</li>
        </ol>
      </div>
    </div>
  );
}
