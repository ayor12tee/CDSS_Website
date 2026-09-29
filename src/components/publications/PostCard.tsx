import Link from 'next/link';
import { CATEGORIES, type Publication } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { Art } from '@/components/ui/primitives';

export function PostMeta({ post }: { post: Pick<Publication, 'publishedOn' | 'readTime'> }) {
  return (
    <div className="post-meta">
      <span>
        <Icon name="calendar" />
        <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time>
      </span>
      <span>
        <Icon name="clock" />
        {post.readTime} min read
      </span>
    </div>
  );
}

export function PostCard({ post }: { post: Publication }) {
  return (
    <Link className="post-card" href={`/publications/${post.slug}`}>
      <div className="post-cover">
        <Art name={post.cover} />
        <span className="cat-pill">{CATEGORIES[post.category].label}</span>
      </div>
      <div className="post-body">
        <PostMeta post={post} />
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="link-arrow">
          Read {post.category === 'guides' ? 'guide' : 'article'}
          <Icon name="arrow" />
        </span>
      </div>
    </Link>
  );
}

export function PostGrid({ posts }: { posts: Publication[] }) {
  return (
    <div className="grid-3 reveal-stagger">
      {posts.map(p => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
