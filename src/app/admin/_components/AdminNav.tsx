'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Role } from '@/lib/types';

type Item = { href: string; label: string; icon: IconName; count?: number; adminOnly?: boolean };

interface AdminNavProps {
  role: Role;
  unread: number;
  children: ReactNode;
  footer: ReactNode;
}

export function AdminShell({ role, unread, children, footer }: AdminNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const groups: { heading: string; items: Item[] }[] = [
    { heading: 'Overview', items: [{ href: '/admin', label: 'Dashboard', icon: 'grid' }] },
    {
      heading: 'Content',
      items: [
        { href: '/admin/publications', label: 'Publications', icon: 'file' },
        { href: '/admin/products', label: 'Products', icon: 'layers' },
        { href: '/admin/industries', label: 'Industries', icon: 'building' },
        { href: '/admin/partners', label: 'Vendor partners', icon: 'handshake' },
        { href: '/admin/clients', label: 'Clients', icon: 'users' },
        { href: '/admin/faqs', label: 'FAQs', icon: 'help' },
        { href: '/admin/media', label: 'Media library', icon: 'image' },
      ],
    },
    {
      heading: 'Enquiries',
      items: [
        { href: '/admin/inbox', label: 'Inbox', icon: 'inbox', count: unread },
        { href: '/admin/subscribers', label: 'Subscribers', icon: 'mail' },
      ],
    },
    {
      heading: 'Administration',
      items: [
        { href: '/admin/settings', label: 'Site settings', icon: 'settings', adminOnly: true },
        { href: '/admin/users', label: 'Users', icon: 'lock', adminOnly: true },
        { href: '/admin/account', label: 'My account', icon: 'user' },
      ],
    },
  ];

  const isCurrent = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'));

  return (
    <div className={`adm-shell${open ? ' nav-open' : ''}`}>
      <div className="adm-mobilebar">
        <Image src="/brand/cdss-logo.png" alt="CDSS" width={113} height={26} />
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
      <aside className="adm-side" aria-label="Admin navigation">
        <Link href="/admin" className="adm-brand">
          <Image src="/brand/cdss-logo.png" alt="CDSS" width={122} height={28} />
          <span>Admin</span>
        </Link>
        <nav className="adm-nav">
          {groups.map(g => {
            const items = g.items.filter(i => !i.adminOnly || role === 'admin');
            if (!items.length) return null;
            return (
              <div key={g.heading} style={{ display: 'contents' }}>
                <h6>{g.heading}</h6>
                {items.map(i => (
                  <Link key={i.href} href={i.href} aria-current={isCurrent(i.href) ? 'page' : undefined}>
                    <Icon name={i.icon} />
                    {i.label}
                    {!!i.count && <span className="count">{i.count}</span>}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="adm-side-foot">{footer}</div>
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  );
}
