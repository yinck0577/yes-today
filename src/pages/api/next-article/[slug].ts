export const prerender = false;
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCategoryName } from '../../../consts';

/**
 * Picks the next article to show for infinite-scroll reading.
 * Priority: same category (most recent first) -> any other category (most recent first),
 * with a light randomisation among the freshest candidates once same-category options run out.
 *
 * GET /api/next-article/{currentSlug}?exclude=slugA,slugB,...
 */
export const GET: APIRoute = async ({ params, url }) => {
	const currentSlug = params.slug;
	if (!currentSlug) {
		return new Response(JSON.stringify({ next: null }), { status: 400 });
	}

	const excludeParam = url.searchParams.get('exclude') || '';
	const exclude = new Set(
		excludeParam
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean),
	);
	exclude.add(currentSlug);

	try {
		const posts = await getCollection('blog');
		const current = posts.find((p) => p.id === currentSlug);
		const candidates = posts.filter((p) => !exclude.has(p.id));

		if (!candidates.length) {
			return new Response(JSON.stringify({ next: null }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const byRecent = (a: (typeof candidates)[number], b: (typeof candidates)[number]) =>
			b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

		const sameCategory = current?.data.category
			? candidates.filter((p) => p.data.category === current.data.category)
			: [];

		let chosen: (typeof candidates)[number];

		if (sameCategory.length) {
			// Same category, most recent first.
			sameCategory.sort(byRecent);
			chosen = sameCategory[0];
		} else {
			// No more same-category candidates: fall back to recency-weighted randomness
			// across everything else, so the feed doesn't feel purely chronological.
			const rest = [...candidates].sort(byRecent);
			const pool = rest.slice(0, Math.min(10, rest.length));
			chosen = pool[Math.floor(Math.random() * pool.length)];
		}

		return new Response(
			JSON.stringify({
				next: {
					id: chosen.id,
					title: chosen.data.title,
					category: chosen.data.category ?? null,
					categoryName: chosen.data.category ? getCategoryName(chosen.data.category) : null,
					url: `/blog/${chosen.id}/`,
				},
			}),
			{ headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
	}
};
