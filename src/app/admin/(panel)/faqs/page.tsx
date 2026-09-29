import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listFaqs } from '../../_lib/queries';

export const metadata: Metadata = { title: 'FAQs' };

const SECTIONS = { home: 'Home page', training: 'Training & Support page' } as const;

export default async function FaqsAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [faqs, { deleted }] = await Promise.all([listFaqs(), searchParams]);
  return (
    <>
      <PageHeader
        title="FAQs"
        actions={
          <Link className="adm-btn primary" href="/admin/faqs/new">
            <Icon name="plus" />
            New question
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="question" />
        {(Object.keys(SECTIONS) as (keyof typeof SECTIONS)[]).map(section => {
          const items = faqs.filter(f => f.section === section);
          return (
            <section className="adm-card" key={section}>
              <div className="adm-card-head">
                <h2>{SECTIONS[section]}</h2>
                <span className="adm-badge">{items.length} questions</span>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <tbody>
                    {items.map(f => (
                      <tr key={f.id}>
                        <td className="title-cell">
                          <Link href={`/admin/faqs/${f.id}`}>{f.question}</Link>
                          <small>{f.answer.slice(0, 120)}…</small>
                        </td>
                        <td className="num" style={{ width: 70 }}>
                          {f.sortOrder}
                        </td>
                        <td className="actions">
                          <Link className="adm-btn secondary sm" href={`/admin/faqs/${f.id}`}>
                            <Icon name="edit" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
