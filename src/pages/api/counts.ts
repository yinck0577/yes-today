export const prerender = false;
import type { APIRoute } from 'astro';

/**
 * Batch endpoint: returns comment counts and like counts for a list of slugs.
 * GET /api/counts?slugs=slug-a,slug-b,slug-c
 */
export const GET: APIRoute = async ({ url, locals }) => {
	const slugsParam = url.searchParams.get('slugs') || '';
	const slugs = slugsParam
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean)
		.slice(0, 50);

	if (!slugs.length) {
		return new Response(JSON.stringify({ counts: {} }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const kv = (locals as any).runtime.env.YES_TODAY_KV;
		const counts: Record<string, { comments: number; likes: number }> = {};

		await Promise.all(
			slugs.map(async (slug) => {
				const [commentsRaw, likesRaw] = await Promise.all([
					kv.get(`comments:${slug}`),
					kv.get(`likes:${slug}`),
				]);
				let commentCount = 0;
				if (commentsRaw) {
					try {
						const parsed = JSON.parse(commentsRaw);
						commentCount = Array.isArray(parsed) ? parsed.length : 0;
					} catch {
						commentCount = 0;
					}
				}
				const likeCount = likesRaw ? parseInt(likesRaw, 10) || 0 : 0;
				counts[slug] = { comments: commentCount, likes: likeCount };
			}),
		);

		return new Response(JSON.stringify({ counts }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
	}
};
