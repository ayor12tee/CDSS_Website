import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { CheckboxField, SelectField, TextField } from '../../../_components/fields';
import { PageHeader } from '../../../_components/PageHeader';
import { deleteClient, saveClient } from '../../../_lib/content-actions';
import { getClientById, listClients } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Edit client' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function ClientEditor({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [c, all] = await Promise.all([isNew ? null : getClientById(id), listClients()]);
  if (!isNew && !c) notFound();
  const groups = [...new Set(all.map(x => x.group).filter((g): g is string => !!g))];

  return (
    <>
      <PageHeader title={c?.name ?? 'New client'} crumbs={[['Clients', '/admin/clients']]} />
      <div className="adm-content" style={{ maxWidth: 860 }}>
        <ActionForm
          action={saveClient}
          submitLabel={c ? 'Save changes' : 'Create client'}
          initialMessage={created ? 'Client created.' : undefined}
          extra={c && <ConfirmButton action={deleteClient.bind(null, c.id)} label="Delete" confirm={`Remove ${c.name} from the website?`} />}
        >
          {c && <input type="hidden" name="id" value={c.id} />}
          <section className="adm-card adm-fields cols-2">
            <TextField name="name" label="Organisation name" required defaultValue={c?.name} full />
            <SelectField
              name="group"
              label="Client Base group"
              defaultValue={c?.group ?? ''}
              options={[{ value: '', label: 'Not on the Client Base page' }, ...groups.map(g => ({ value: g, label: g })), { value: '__new', label: 'New group…' }]}
            />
            <TextField name="newGroup" label="New group name" hint="Only used when “New group…” is selected." />
            <TextField name="sortOrder" type="number" label="Order" defaultValue={c?.sortOrder ?? 0} hint="Lower numbers appear first." />
            <div className="adm-field" style={{ justifyContent: 'center' }}>
              <CheckboxField name="onLogoWall" label="Show on the home page logo wall" defaultChecked={c?.onLogoWall} />
            </div>
          </section>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Names are shown as a factual record of client relationships. Only list organisations CDSS has actually worked with.
          </p>
        </ActionForm>
      </div>
    </>
  );
}
