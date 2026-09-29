const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-15" -> "15 Sep 2026" (no timezone surprises). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Heading text -> anchor id. Used by both the MDX h2 renderer and the table of contents. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[*_`]/g, '')
    .replace(/&amp;|&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max).replace(/\s\S*$/, '') + '…';
}
