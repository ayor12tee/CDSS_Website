'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CATEGORIES as categories, type Category, type Publication } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { PostCard } from './PostCard';

type Filter = Category | 'all';
const isCategory = (v: string | null): v is Category => !!v && v in categories;

export function PublicationsBrowser({ posts }: { posts: Publication[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const fromUrl = params.get('category');
  const category: Filter = isCategory(fromUrl) ? fromUrl : 'all';
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c = { all: posts.length } as Record<Filter, number>;
    (Object.keys(categories) as Category[]).forEach(k => (c[k] = posts.filter(p => p.category === k).length));
    return c;
  }, [posts]);

  const q = query.trim().toLowerCase();
  const visible = posts.filter(
    p => (category === 'all' || p.category === category) && (!q || [p.title, p.excerpt, ...p.tags].join(' ').toLowerCase().includes(q)),
  );

  const choose = (f: Filter) => {
    router.replace(f === 'all' ? pathname : `${pathname}?category=${f}`, { scroll: false });
  };

  const filters: [Filter, string][] = [['all', 'All'], ...(Object.entries(categories) as [Category, { label: string }][]).map(([k, v]) => [k, v.label] as [Filter, string])];

  return (
    <>
      <div className="pub-toolbar">
        <div className="filter-chips" role="group" aria-label="Filter by category">
          {filters.map(([key, label]) => (
            <button key={key} type="button" aria-pressed={category === key} onClick={() => choose(key)}>
              {label}
              <span className="count">{counts[key]}</span>
            </button>
          ))}
        </div>
        <label className="search-box">
          <Icon name="search" />
          <span className="sr-only">Search publications</span>
          <input type="search" placeholder="Search publications" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
      </div>
      {visible.length > 0 ? (
        <div className="grid-3">
          {visible.map(p => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state show">
          <h3 style={{ marginBottom: 8 }}>No publications match your search.</h3>
          <p>Try a different keyword or category.</p>
        </div>
      )}
    </>
  );
}
