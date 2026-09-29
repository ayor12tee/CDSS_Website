'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { navKeyFor, tel, type NavItem } from '@/content/site';
import type { SiteSettings } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';

interface HeaderProps {
  nav: NavItem[];
  company: SiteSettings['company'];
  announcement: SiteSettings['announcement'];
}

export function Header({ nav, company, announcement }: HeaderProps) {
  const pathname = usePathname();
  const current = navKeyFor(pathname);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // after clicking a menu link, keep that menu closed even though the pointer is still over it
  const [suppressed, setSuppressed] = useState<string | null>(null);

  const closeAfterClick = (key: string) => (e: ReactMouseEvent) => {
    const link = (e.target as Element).closest('a');
    if (!link) return;
    setOpenMenu(null);
    setSuppressed(key);
    link.blur();
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close menus whenever the route changes (state reset during render; see React docs on adjusting state on prop change).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('drawer-open', drawerOpen);
    if (drawerOpen) closeRef.current?.focus();
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      if (drawerOpen) closeDrawer();
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.nav-item[data-menu]')) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="topbar">
        <div className="container">
          <div className="topbar-group">
            <a href={tel(company.phones[0])}>
              <Icon name="phone" />
              {company.phones[0]}
            </a>
            <a className="topbar-mail" href={`mailto:${company.email}`}>
              <Icon name="mail" />
              {company.email}
            </a>
            <span className="topbar-loc hide-md">
              <Icon name="pin" />
              {company.locationShort}
            </span>
          </div>
          <div className="topbar-group right">
            {announcement.enabled && (
              <Link className="topbar-badge" href={announcement.href || '/'}>
                <Icon name="award" />
                {announcement.text}
                {announcement.label ? `, ${announcement.label}` : ''}
              </Link>
            )}
            <Link href="/training#remote">
              <Icon name="monitor" />
              Remote Support
            </Link>
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Link className="brand-logo" href="/" aria-label="CDSS home">
            <Image src="/brand/cdss-logo.png" alt="CDSS — Computer Designs, Systems, Services (Nig.) Limited" width={157} height={36} priority />
          </Link>

          <nav className="nav-main" aria-label="Primary">
            {nav.map(item => {
              const open = openMenu === item.key;
              const cls = `nav-item${item.type === 'dropdown' ? ' has-dropdown' : ''}${open ? ' open' : ''}${suppressed === item.key ? ' suppress' : ''}`;
              return (
                <div
                  className={cls}
                  data-menu
                  key={item.key}
                  onMouseLeave={() => {
                    setOpenMenu(null);
                    setSuppressed(null);
                  }}
                >
                  <Link
                    className={`nav-link${item.key === current ? ' is-current' : ''}`}
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={e => {
                      e.preventDefault();
                      setOpenMenu(open ? null : item.key);
                    }}
                  >
                    {item.label}
                    <Icon name="chevron" />
                  </Link>

                  {item.type === 'mega' ? (
                    <div className="mega" onClick={closeAfterClick(item.key)}>
                      <div className="mega-inner" style={{ '--cols': item.cols } as CSSProperties}>
                        {item.groups.map(group => (
                          <div className="mega-col" key={group.heading}>
                            <h6>{group.heading}</h6>
                            {group.links.map(l => (
                              <Link className="mega-link" href={l.href} key={l.href}>
                                <strong>{l.title}</strong>
                                <span>{l.desc}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                        <Link className="mega-feature" href={item.feature.href}>
                          <Image src={`/img/${item.feature.img}.svg`} alt="" width={800} height={500} unoptimized />
                          <small>{item.feature.small}</small>
                          <strong>{item.feature.title}</strong>
                          <span className="link-arrow on-dark">
                            {item.feature.cta}
                            <Icon name="arrow" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="dropdown" onClick={closeAfterClick(item.key)}>
                      {item.links.map(l => (
                        <Link className="mega-link" href={l.href} key={l.href}>
                          <strong>{l.title}</strong>
                          <span>{l.desc}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="header-actions">
            <Link className="btn btn-primary btn-sm" href="/contact">
              Speak to an Expert
            </Link>
            <button
              ref={burgerRef}
              className="burger"
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="drawer"
              onClick={() => setDrawerOpen(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      <div className="drawer-backdrop" onClick={closeDrawer} />
      <aside className="drawer" id="drawer" aria-label="Menu" inert={!drawerOpen}>
        <div className="drawer-head">
          <Image src="/brand/cdss-logo.png" alt="CDSS" width={131} height={30} />
          <button ref={closeRef} className="burger drawer-close" style={{ display: 'inline-flex' }} type="button" aria-label="Close menu" onClick={closeDrawer}>
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">
          {nav.map(item => {
            const links = item.type === 'mega' ? [...item.groups.flatMap(g => g.links), { title: item.all.title, href: item.all.href }] : item.links;
            return (
              <details key={item.key} open={item.key === current}>
                <summary>
                  {item.label}
                  <Icon name="chevron" />
                </summary>
                <div>
                  {links.map(l => (
                    <Link href={l.href} key={l.href} onClick={() => setDrawerOpen(false)}>
                      {l.title}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
          <Link className="drawer-link" href="/contact" onClick={() => setDrawerOpen(false)}>
            Contact
          </Link>
        </div>
        <div className="drawer-foot">
          <Link className="btn btn-primary btn-block" href="/contact" onClick={() => setDrawerOpen(false)}>
            Speak to an Expert
          </Link>
          <a className="btn btn-outline btn-block" href={tel(company.phones[0])}>
            <Icon name="phone" />
            {company.phones[0]}
          </a>
        </div>
      </aside>
    </>
  );
}
