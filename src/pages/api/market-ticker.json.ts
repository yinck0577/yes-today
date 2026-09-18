export const prerender = false;
import type { APIRoute } from 'astro';
import { fetchAllMarkets, isTaiwanMarketHours, type MarketQuote } from '../../server/marketProviders';

const CACHE_KEY = 'market-ticker:v1';

// During TW trading hours, refresh often enough to feel current without
// hammering the exchanges. Outside trading hours (including the US-only
// EOD data), there is nothing new to fetch for hours at a time.
const TTL_TRADING_SECONDS = 3 * 60;
const TTL_CLOSED_SECONDS = 60 * 60;

interface CachedPayload {
  	quotes: MarketQuote[];
	fetchedAt: string;
}

export const GET: APIRoute = async ({ locals }) => {
  	const kv = (locals as any)?.runtime?.env?.YES_TODAY_KV;
	const marketstackApiKey = (locals as any)?.runtime?.env?.MARKETSTACK_API_KEY as string | undefined;

	let cached: CachedPayload | null = null;
	if (kv) {
		try {
			const raw = await kv.get(CACHE_KEY);
			if (raw) cached = JSON.parse(raw);
} catch {
  			cached = null;
}
}

	const ttlSeconds = isTaiwanMarketHours() ? TTL_TRADING_SECONDS : TTL_CLOSED_SECONDS;
	const isFresh =
		cached && Date.now() - new Date(cached.fetchedAt).getTime() < ttlSeconds * 1000 && cached.quotes.length > 0;

	if (isFresh) {
    		return new Response(JSON.stringify({ quotes: cached!.quotes, fetchedAt: cached!.fetchedAt, cache: 'hit' }), {
    			headers: { 'Content-Type': 'application/json' },
  });
}

	// Cache is stale or missing: fetch fresh data. If this fails entirely,
	// fall back to whatever we last had (even if stale) rather than
	// showing nothing — a slightly old market snapshot beats an empty bar.
	try {
    		const quotes = await fetchAllMarkets(marketstackApiKey);
		if (quotes.length > 0) {
			const payload: CachedPayload = { quotes, fetchedAt: new Date().toISOString() };
			if (kv) {
        				try {
					await kv.put(CACHE_KEY, JSON.stringify(payload));
      } catch {
        					// Non-fatal: still return the fresh data even if the write fails.
      }
}
			return new Response(JSON.stringify({ ...payload, cache: 'miss' }), {
        				headers: { 'Content-Type': 'application/json' },
      });
}
} catch {
  		// fall through to stale-cache fallback below
}

	if (cached && cached.quotes.length > 0) {
    		return new Response(JSON.stringify({ quotes: cached.quotes, fetchedAt: cached.fetchedAt, cache: 'stale' }), {
    			headers: { 'Content-Type': 'application/json' },
  });
  }

	// No fresh data and nothing cached at all — let the client know so it
	// can hide the ticker instead of rendering broken/empty markets.
	return new Response(JSON.stringify({ quotes: [], fetchedAt: null, cache: 'empty' }), {
    		headers: { 'Content-Type': 'application/json' },
  });
  };
