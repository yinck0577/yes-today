// Search synonym groups. Each group is a list of interchangeable terms —
// searching for any term in a group also searches for every other term in
// that group. This keeps the mapping separate from the search UI/engine so
// editors (or a future admin tool) can extend it without touching code that
// renders or scores results.
//
// Write terms in a form consistent with normalizeText() (ASCII lowercased;
// 臺/台 are already unified by normalizeText, so you don't need both here,
// though listing both is harmless).
export const SEARCH_SYNONYM_GROUPS: string[][] = [
['日治', '日治時期', '日治時代', '日本統治', '日本時代'],
['日本', '日本時代', '日治', '日治時期'],
['台北', 'taipei', 'taihoku', '台北州'],
['新冠', 'covid-19', 'covid'],
['川普', 'trump'],
['ai', '人工智慧'],
['颱風', '台風'],
];

const ASCII_WORD_RE = /^[a-z0-9][a-z0-9-]*$/i;

function escapeRegExp(s: string): string {
return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function termMatches(haystack: string, needle: string): boolean {
if (!haystack || !needle) return false;
if (ASCII_WORD_RE.test(needle) && ASCII_WORD_RE.test(haystack)) {
return new RegExp(`\\b${escapeRegExp(needle)}\\b`).test(haystack);
}
return haystack.includes(needle);
}

export function expandQueryWithSynonyms(normalizedQuery: string): string[] {
const variants = new Set<string>([normalizedQuery]);
for (const group of SEARCH_SYNONYM_GROUPS) {
const groupMatches = group.some(
(term) => termMatches(term, normalizedQuery) || termMatches(normalizedQuery, term),
);
if (groupMatches) {
for (const term of group) variants.add(term);
}
}
return Array.from(variants);
}
