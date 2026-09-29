import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SetupNotice, setupProblems } from '../_components/SetupNotice';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reset?: string }> }) {
  const problems = setupProblems();
  if (problems.length) return <SetupNotice problems={problems} />;
  if (await getCurrentUser()) redirect('/admin');
  const { next = '/admin', reset } = await searchParams;

  return (
    <div className="adm-login">
      <div>
        <div className="adm-login-card">
          <Image src="/brand/cdss-logo.png" alt="CDSS" width={148} height={34} priority />
          <h1>Sign in to the admin</h1>
          <p className="sub">Manage website content, enquiries and subscribers.</p>
          {reset === '2fa' && (
            <div className="adm-notice info" style={{ marginBottom: 18 }}>
              Your authenticator was removed. Sign in again to set up your new phone.
            </div>
          )}
          <LoginForm next={next} />
        </div>
        <p className="adm-login-foot">
          <Link href="/">← Back to the website</Link>
        </p>
      </div>
    </div>
  );
}
