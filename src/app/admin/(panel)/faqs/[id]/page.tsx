import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { SelectField, TextAreaField, TextField } from '../../../_components/fields';
import { PageHeader } from '../../../_components/PageHeader';
import { deleteFaq, saveFaq } from '../../../_lib/content-actions';
import { getFaqById } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Edit FAQ' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function FaqEditor({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const f = isNew ? null : await getFaqById(id);
  if (!isNew && !f) notFound();

  return (
    <>
      <PageHeader title={f ? 'Edit question' : 'New question'} crumbs={[['FAQs', '/admin/faqs']]} />
      <div className="adm-content" style={{ maxWidth: 860 }}>
        <ActionForm
          action={saveFaq}
          submitLabel={f ? 'Save changes' : 'Create question'}
          initialMessage={created ? 'Question created.' : undefined}
          extra={f && <ConfirmButton action={deleteFaq.bind(null, f.id)} label="Delete" confirm="Delete this question?" />}
        >
          {f && <input type="hidden" name="id" value={f.id} />}
          <section className="adm-card adm-fields cols-2">
            <SelectField
              name="section"
              label="Shown on"
              defaultValue={f?.section ?? 'home'}
              options={[
                { value: 'home', label: 'Home page' },
                { value: 'training', label: 'Training & Support page' },
              ]}
            />
            <TextField name="sortOrder" type="number" label="Order" defaultValue={f?.sortOrder ?? 0} hint="Lower numbers appear first. The first question starts open." />
            <TextField name="question" label="Question" required defaultValue={f?.question} full />
            <TextAreaField name="answer" label="Answer" required rows={5} defaultValue={f?.answer} full />
          </section>
        </ActionForm>
      </div>
    </>
  );
}
