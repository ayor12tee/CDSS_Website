import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth/session';

/**
 * First line of defence for /admin: reject requests without a validly signed session cookie.
 * Pages and server actions still call requireUser(), which also checks the user in the database.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // sign-in, authenticator set-up and code entry are reachable without a full session
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) return NextResponse.next();

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    if (pathname.startsWith('/admin/api/')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const login = new URL('/admin/login', request.url);
    if (pathname !== '/admin') login.searchParams.set('next', pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
