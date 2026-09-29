import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PENDING_COOKIE, verifyPending } from '@/lib/auth/session';
import { VerifyForm } from './VerifyForm';

export const metadata: Metadata = { title: 'Enter your code' };

export default async function VerifyPage() {
  const claims = await verifyPending((await cookies()).get(PENDING_COOKIE)?.value);
  if (!claims || claims.stage !== 'verify') redirect('/admin/login');

  return (
    <div className="adm-login">
      <div>
        <div className="adm-login-card">
          <Image src="/brand/cdss-logo.png" alt="CDSS" width={148} height={34} priority />
          <VerifyForm />
        </div>
        <p className="adm-login-foot">
          <Link href="/admin/login">← Use a different account</Link>
        </p>
      </div>
    </div>
  );
}
