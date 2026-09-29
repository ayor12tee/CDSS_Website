import { getCurrentUser } from '@/lib/auth';
import { requireDb } from '@/lib/supabase';

/** CSV export of newsletter subscribers (signed-in users only). */
export async function GET() {
  if (!(await getCurrentUser())) return new Response('Unauthorized', { status: 401 });
  const { data, error } = await requireDb().from('subscribers').select('email, source, created_at').order('created_at');
  if (error) return new Response(error.message, { status: 500 });

  // quote every cell and neutralise spreadsheet formulas (=, +, -, @)
  const cell = (v: string) => `"${String(v).replace(/^[=+\-@]/, "'$&").replace(/"/g, '""')}"`;
  const csv = ['email,source,subscribed_at', ...data.map(r => [r.email, r.source, r.created_at].map(cell).join(','))].join('\r\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cdss-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
