'use client';

import { useDeferredValue, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Markdown } from '@/components/markdown/Markdown';
import { useFormState } from './ActionForm';

type Mode = 'write' | 'split' | 'preview';
type ToolId = 'h2' | 'h3' | 'bold' | 'italic' | 'link' | 'ul' | 'ol' | 'quote' | 'callout' | 'facts';

const TOOLS: { id: ToolId; icon?: IconName; text?: string; title: string }[] = [
  { id: 'h2', icon: 'heading', title: 'Section heading (appears in the table of contents)' },
  { id: 'h3', text: 'H3', title: 'Sub-heading' },
  { id: 'bold', icon: 'bold', title: 'Bold' },
  { id: 'italic', icon: 'italic', title: 'Italic' },
  { id: 'link', icon: 'link', title: 'Link' },
  { id: 'ul', icon: 'list', title: 'Bulleted list' },
  { id: 'ol', icon: 'listOrdered', title: 'Numbered list' },
  { id: 'quote', icon: 'quote', title: 'Pull quote with attribution' },
  { id: 'callout', icon: 'info', text: 'Callout', title: 'Callout box' },
  { id: 'facts', icon: 'grid', text: 'Facts', title: 'Key facts row' },
];

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
  /** images from the media library that can be inserted */
  images?: { url: string; filename: string; alt: string }[];
}

/** Markdown textarea with a formatting toolbar and a live preview that uses the website's own renderer. */
export function MarkdownEditor({ name, defaultValue = '', images = [] }: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>('split');
  const [showImages, setShowImages] = useState(false);
  const preview = useDeferredValue(value);
  const ref = useRef<HTMLTextAreaElement>(null);
  const error = useFormState().fieldErrors?.[name];

  /** Wrap the selection (or insert a template) and keep the cursor sensible. */
  function apply(before: string, after = '', placeholder = '', block = false) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    let prefix = before;
    if (block && s > 0 && value[s - 1] !== '\n') prefix = '\n\n' + prefix;
    const insert = prefix + selected + after;
    const next = value.slice(0, s) + insert + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const start = s + prefix.length;
      el.setSelectionRange(start, start + selected.length);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function linePrefix(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    // operate on every whole line touched by the selection
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const nl = value.indexOf('\n', e);
    const lineEnd = nl === -1 ? value.length : nl;
    const block = value.slice(lineStart, lineEnd) || 'List item';
    const replaced = block
      .split('\n')
      .map((l, i) => (prefix === '1. ' ? `${i + 1}. ` : prefix) + l.replace(/^\s*([-*>]|\d+\.)\s+/, ''))
      .join('\n');
    setValue(value.slice(0, lineStart) + replaced + value.slice(lineEnd));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + replaced.length);
    });
  }

  function runTool(id: ToolId) {
    switch (id) {
      case 'h2':
        return apply('## ', '', 'Section heading', true);
      case 'h3':
        return apply('### ', '', 'Sub-heading', true);
      case 'bold':
        return apply('**', '**', 'bold text');
      case 'italic':
        return apply('_', '_', 'italic text');
      case 'link':
        return apply('[', '](https://)', 'link text');
      case 'ul':
        return linePrefix('- ');
      case 'ol':
        return linePrefix('1. ');
      case 'quote':
        return apply('> ', '\n>\n> — Name, Title', 'Quote text', true);
      case 'callout':
        return apply(':::callout{icon=info title="Callout heading"}\n', '\n:::', 'Callout text with [a link](/contact).', true);
      case 'facts':
        return apply(':::facts\n', '\n:::', '- **1989** First fact\n- **1992** Second fact\n- **2025** Third fact', true);
    }
  }

  return (
    <div className={`adm-field full${error ? ' invalid' : ''}`}>
      <span className="label">
        Article body <span className="req">*</span>
      </span>
      <div className="md-editor">
        <div className="md-toolbar" role="toolbar" aria-label="Formatting">
          {TOOLS.map(t => (
            <button type="button" key={t.id} title={t.title} aria-label={t.title} onClick={() => runTool(t.id)}>
              {t.icon && <Icon name={t.icon} />}
              {t.text}
            </button>
          ))}
          <span className="sep" />
          <button type="button" title="Insert an image from the media library" onClick={() => setShowImages(v => !v)}>
            <Icon name="image" />
            Image
          </button>
          <div className="modes" role="group" aria-label="View">
            {(['write', 'split', 'preview'] as Mode[]).map(m => (
              <button type="button" key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>
                {m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {showImages && (
          <div style={{ padding: 12, borderBottom: '1px solid var(--line)', background: '#fff' }}>
            {images.length === 0 ? (
              <span className="hint">No images yet. Upload them under Media, then insert them here.</span>
            ) : (
              <div className="adm-picker">
                {images.map(img => (
                  <button
                    type="button"
                    className="adm-pick"
                    key={img.url}
                    onClick={() => {
                      apply(`![${img.alt || img.filename}](${img.url})`, '', '', true);
                      setShowImages(false);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" />
                    <span>{img.filename}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={`md-panes${mode === 'split' ? ' split' : ''}`}>
          <textarea
            ref={ref}
            id={`f-${name}`}
            name={name}
            value={value}
            onChange={e => setValue(e.target.value)}
            spellCheck
            aria-label="Article body (Markdown)"
            style={{ display: mode === 'preview' ? 'none' : undefined }}
          />
          {mode !== 'write' && (
            <div className="md-preview prose" aria-label="Preview">
              {preview.trim() ? <Markdown>{preview}</Markdown> : <p style={{ color: 'var(--muted)' }}>Nothing to preview yet.</p>}
            </div>
          )}
        </div>
        <div className="md-help">
          Write in Markdown. The first paragraph is styled as the introduction. <code>## Heading</code> sections build the &ldquo;On this page&rdquo; menu. End a
          quote with a <code>— Name, Title</code> line to credit it. Use the toolbar for callouts and key-fact rows.
        </div>
      </div>
      {error && <span className="field-err">{error}</span>}
    </div>
  );
}
