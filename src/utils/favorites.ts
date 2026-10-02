// Shared "收藏 / Favorites" data layer.
//
// Phase 1 stores favorites in the browser's localStorage, keyed by a stable
// article identifier (the content-collection slug / post.id — never the
// title, since titles can be edited). Every call site (homepage cards,
// hero carousel, oddity bar, article page) goes through the functions
// below instead of touching localStorage directly, so a future move to a
// server-backed / account-based store only requires swapping the adapter
// in this one file.

export interface FavoritesAdapter {
	getAll(): string[];
	has(id: string): boolean;
	add(id: string): void;
	remove(id: string): void;
}

const STORAGE_KEY = 'yestoday:favorites';

function readRaw(): string[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
	} catch {
		return [];
	}
}

function writeRaw(ids: string[]): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
	} catch {
		// Storage can throw in private-browsing modes or when quota is
		// exceeded. Favorites are a non-critical enhancement, so fail silent.
	}
}

// Default, phase-1 backend. Swap via setFavoritesAdapter() later (e.g. for
// a server/account-backed store) without changing any call site.
const localStorageAdapter: FavoritesAdapter = {
	getAll: readRaw,
	has(id) {
		return readRaw().includes(id);
	},
	add(id) {
		const current = readRaw();
		if (!current.includes(id)) writeRaw([...current, id]);
	},
	remove(id) {
		writeRaw(readRaw().filter((x) => x !== id));
	},
};

let adapter: FavoritesAdapter = localStorageAdapter;

/** Swap the storage backend. Intended for a future server-backed adapter. */
export function setFavoritesAdapter(next: FavoritesAdapter): void {
	adapter = next;
}

export function getFavorites(): string[] {
	return adapter.getAll();
}

export function isFavorite(articleId: string): boolean {
	return adapter.has(articleId);
}

export const FAVORITES_CHANGE_EVENT = 'yestoday:favorites-change';

function notify(articleId: string): void {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(
		new CustomEvent(FAVORITES_CHANGE_EVENT, { detail: { articleId } }),
	);
}

export function addFavorite(articleId: string): void {
	adapter.add(articleId);
	notify(articleId);
}

export function removeFavorite(articleId: string): void {
	adapter.remove(articleId);
	notify(articleId);
}

/** Toggles favorite state for articleId and returns the new state. */
export function toggleFavorite(articleId: string): boolean {
	const next = !isFavorite(articleId);
	if (next) addFavorite(articleId);
	else removeFavorite(articleId);
	return next;
}

/**
 * Subscribe to favorites changes from any source: this tab's own toggles
 * (via the custom event) and other tabs/windows (via the native `storage`
 * event). Call this once per page — not once per button; fan the result
 * out to individual UI elements yourself. Returns an unsubscribe function.
 */
export function onFavoritesChange(
	handler: (articleId: string | null) => void,
): () => void {
	function onCustom(e: Event) {
		const detail = (e as CustomEvent).detail || {};
		handler(detail.articleId ?? null);
	}
	function onStorage(e: StorageEvent) {
		if (e.key === STORAGE_KEY) {
			// Another tab changed the list; we don't know which id, so the
			// caller should repaint everything.
			handler(null);
		}
	}
	window.addEventListener(FAVORITES_CHANGE_EVENT, onCustom);
	window.addEventListener('storage', onStorage);
	return () => {
		window.removeEventListener(FAVORITES_CHANGE_EVENT, onCustom);
		window.removeEventListener('storage', onStorage);
	};
}
