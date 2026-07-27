export const prerender = false;
import type { APIRoute } from 'astro';

const ANIMALS = ['棕熊', '袋鼠', '水糌', '狐狸', '企鵝', '貓頭鵰', '刺蚜', '浣熊', '樹懶', '海獐'];

function randomName() {
	return '匿名' + ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

function escapeHtml(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function isSafeUrl(url: string): boolean {
	return /^https?:\/\//i.test(url);
}

/**
 * Render a very small, safe subset of formatting from raw user text:
 * - **bold**
 * - *italic*
 * - [text](https://...)
 * - line breaks
 * Everything else is HTML-escaped first, so no raw HTML can be injected.
 */
function renderSafeContent(raw: string): string {
	let escaped = escapeHtml(raw);

	// links: [text](https://...)
	escaped = escaped.replace(/\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]{1,500})\)/g, (_m, text, url) => {
		if (!isSafeUrl(url)) return escapeHtml(text);
		return `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${text}</a>`;
	});

	// bold **text**
	escaped = escaped.replace(/\*\*([^*\n]{1,200})\*\*/g, '<strong>$1</strong>');
	// italic *text*
	escaped = escaped.replace(/\*([^*\n]{1,200})\*/g, '<em>$1</em>');
	// newlines
	escaped = escaped.replace(/\n/g, '<br />');

	return escaped;
}

interface StoredComment {
	id: string;
	name: string;
	content: string;
	createdAt: string;
}

export const GET: APIRoute = async ({ params, locals }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response(JSON.stringify({ error: 'missing slug' }), { status: 400 });
	}
	try {
		const kv = (locals as any).runtime.env.YES_TODAY_KV;
		const raw = await kv.get(`comments:${slug}`);
		const comments: StoredComment[] = raw ? JSON.parse(raw) : [];
		const rendered = comments.map((c) => ({
			id: c.id,
			name: escapeHtml(c.name).slice(0, 60),
			contentHtml: renderSafeContent(c.content),
			createdAt: c.createdAt,
		}));
		return new Response(JSON.stringify({ comments: rendered }), {
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
		return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400 });
	}

	let name = typeof body?.name === 'string' ? body.name.trim() : '';
	let content = typeof body?.content === 'string' ? body.content.trim() : '';

	if (!content) {
		return new Response(JSON.stringify({ error: '留言內容不能為空' }), { status: 400 });
	}
	if (content.length > 500) {
		content = content.slice(0, 500);
	}
	if (!name) {
		name = randomName();
	}
	name = name.slice(0, 30);

	try {
		const kv = (locals as any).runtime.env.YES_TODAY_KV;
		const raw = await kv.get(`comments:${slug}`);
		const comments: StoredComment[] = raw ? JSON.parse(raw) : [];

		const comment: StoredComment = {
			id: crypto.randomUUID(),
			name,
			content,
			createdAt: new Date().toISOString(),
		};
		comments.push(comment);

		// keep only the most recent 200 comments per article to bound storage size
		const trimmed = comments.slice(-200);
		await kv.put(`comments:${slug}`, JSON.stringify(trimmed));

		return new Response(
			JSON.stringify({
				comment: {
					id: comment.id,
					name: escapeHtml(comment.name),
					contentHtml: renderSafeContent(comment.content),
					createdAt: comment.createdAt,
				},
			}),
			{ headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
	}
};
