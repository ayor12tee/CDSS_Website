// Renders article Markdown. Used on the public site (server) and in the admin live preview (client).
// Raw HTML is never rendered. Supported extras on top of GitHub-flavoured Markdown:
//
//   :::callout{icon=award title="Heading"}          :::facts
//   Body text with [a link](/contact).              - **1989** What happened
//   :::                                             :::
//
//   > Quote text
//   >
//   > — Name, Title          (a final "— " line becomes the attribution)
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { Icon, type IconName, ICON_NAMES } from '@/components/ui/Icon';
import { slugify } from '@/lib/format';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Node = any;

function textOf(node: Node): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** Maps directives and quote attributions onto HTML elements the components below understand. */
function remarkCdss() {
  return (tree: Node) => {
    visit(tree, (node: Node, index: number | undefined, parent: Node) => {
      if (node.type === 'containerDirective') {
        const data = (node.data ??= {});
        if (node.name === 'callout') {
          data.hName = 'aside';
          data.hProperties = { className: ['callout'], dataIcon: node.attributes?.icon ?? 'file', dataTitle: node.attributes?.title ?? '' };
        } else if (node.name === 'facts') {
          data.hName = 'div';
          data.hProperties = { className: ['key-facts'] };
          visit(node, 'list', (l: Node) => void (l.data = { hName: 'div', hProperties: { className: ['kf-list'] } }));
          visit(node, 'listItem', (li: Node) => void (li.data = { hName: 'div' }));
        } else {
          data.hName = 'div';
        }
        return;
      }
      // Anything else that merely looks like a directive (e.g. "Note:this") goes back to plain text.
      if ((node.type === 'textDirective' || node.type === 'leafDirective') && parent && index !== undefined) {
        const text = { type: 'text', value: `${node.type === 'leafDirective' ? '::' : ':'}${node.name}${textOf(node)}` };
        parent.children.splice(index, 1, node.type === 'leafDirective' ? { type: 'paragraph', children: [text] } : text);
        return index;
      }
      if (node.type === 'blockquote') {
        const last = node.children?.[node.children.length - 1];
        if (last?.type === 'paragraph' && /^\s*(—|--)\s/.test(textOf(last)) && node.children.length > 1) {
          last.data = { hName: 'cite' };
        }
      }
    });
  };
}

function textOfReact(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(textOfReact).join('');
  if (children && typeof children === 'object' && 'props' in children) return textOfReact((children as { props: { children?: ReactNode } }).props.children);
  return '';
}

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(textOfReact(children))}>{children}</h2>,
  a: ({ href = '', children }) =>
    href.startsWith('/') ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  aside: ({ children, ...props }: ComponentProps<'aside'> & { node?: unknown }) => {
    const p = props as Record<string, string>;
    const icon = (ICON_NAMES as readonly string[]).includes(p['data-icon']) ? (p['data-icon'] as IconName) : 'file';
    return (
      <div className="callout">
        <Icon name={icon} />
        <div>
          {p['data-title'] && <strong>{p['data-title']}</strong>}
          {children}
        </div>
      </div>
    );
  },
  img: ({ src, alt }) =>
    // eslint-disable-next-line @next/next/no-img-element
    typeof src === 'string' ? <img src={src} alt={alt ?? ''} loading="lazy" /> : null,
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkDirective, remarkCdss]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

/** "## Heading" lines, for an article's table of contents. */
export function markdownToc(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*#*$/gm)].map(m => {
    const title = m[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '');
    return { id: slugify(title), title };
  });
}
