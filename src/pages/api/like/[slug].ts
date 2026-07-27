export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response(JSON.stringify({ error: 'missing slug' }), { status: 400 });
	}
	try {
		const kv = (locals as any).runtime.env.YES_TODAY_KV;
		const raw = await kv.get(`likes:${slug}`);
		const count = raw ? parseInt(raw, 10) || 0 : 0;
		return new Response(JSON.stringify({ count }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
	}
};

export const POST: APIRoute = async ({ params, request, locals }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response(JSON.stringify({ error: 'missing slug' }), { status: 400 });
	}

	let body: any;
	try {
		body = await request.json();
	} catch {
		body = {};
	}
	const action = body?.action === 'unlike' ? 'unlike' : 'like';

	try {
		const kv = (locals as any).runtime.env.YES_TODAY_KV;
		const key = `likes:${slug}`;
		const raw = await kv.get(key);
		let count = raw ? parseInt(raw, 10) || 0 : 0;
		count = action === 'like' ? count + 1 : Math.max(0, count - 1);
		await kv.put(key, String(count));
		return new Response(JSON.stringify({ count }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
	}
};
