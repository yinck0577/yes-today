// Converts a raw Markdown article body into plain, searchable text: no
// syntax markers, no URLs, collapsed whitespace. This runs once at build
// time (see search-index.json.ts) — never in the browser.
export function stripMarkdown(raw: string): string {
  	if (!raw) return '';
  	let text = raw;

	// Fenced and inline code (drop entirely — rarely useful for search).
	text = text.replace(/```[\s\S]*?```/g, ' ');
  	text = text.replace(/`([^`]*)`/g, '$1');

	// Images: drop, alt text is usually redundant with the caption/description.
	text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  	// Links: keep the visible text, drop the URL.
	text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

	// Any raw HTML tags.
	text = text.replace(/<[^>]+>/g, ' ');

	// Heading / blockquote / list markers at the start of a line.
	text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');
  	text = text.replace(/^\s{0,3}>+\s?/gm, '');
  	text = text.replace(/^\s{0,3}[-*+]\s+/gm, '');
  	text = text.replace(/^\s{0,3}\d+\.\s+/gm, '');

	// Emphasis markers.
	text = text.replace(/(\*\*\*|\*\*|\*|___|__|_|~~)/g, '');

	// Table pipes and separator rows.
	text = text.replace(/\|/g, ' ');
  	text = text.replace(/^-{2,}\s*$/gm, '');

	// Collapse all whitespace/newlines into single spaces.
	text = text.replace(/\s+/g, ' ').trim();

	return text;
}
