import type { Metadata } from 'next';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import QRCode from 'qrcode';
import { getCurrentUser } from '@/lib/auth';
import { PENDING_COOKIE, verifyPending } from '@/lib/auth/session';
import { encryptSecret, formatSecret, generateTotpSecret, otpauthUrl } from '@/lib/auth/totp';
import { requireDb } from '@/lib/supabase';
import { SetupForm } from './SetupForm';

export const metadata: Metadata = { title: 'Set up two-factor authentication' };

export default async function SetupPage() {
  const claims = await verifyPending((await cookies()).get(PENDING_COOKIE)?.value);

  if (!claims || claims.stage !== 'enrol') {
    // Just finished set-up in this browser: keep the page so the backup codes stay on screen.
    if (await getCurrentUser()) return <Shell><SetupForm /></Shell>;
    redirect('/admin/login');
  }

  const { data: user } = await requireDb().from('users').select('id, email, session_version, totp_secret').eq('id', claims.sub).maybeSingle();
  if (!user || user.session_version !== claims.v) redirect('/admin/login');
  if (user.totp_secret) redirect('/admin/login');

  const secret = generateTotpSecret();
  const qrSvg = await QRCode.toString(otpauthUrl(user.email, secret), { type: 'svg', margin: 1, width: 196, color: { dark: '#0a0d2b', light: '#ffffff' } });

  return (
    <Shell>
      <SetupForm qrSvg={qrSvg} secret={formatSecret(secret)} pendingSecret={encryptSecret(`${user.id}:${secret}`)} email={user.email} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-login">
      <div className="adm-login-card" style={{ width: 'min(520px, 100%)' }}>
        <Image src="/brand/cdss-logo.png" alt="CDSS" width={148} height={34} priority />
        {children}
      </div>
    </div>
  );
}
