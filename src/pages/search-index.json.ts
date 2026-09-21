import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCategoryName } from '../consts';
import { stripMarkdown } from '../utils/stripMarkdown';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

const docs = posts.map((post) => ({
slug: post.id,
title: post.data.title,
description: post.data.description,
category: post.data.category ?? '',
categoryName: post.data.category ? getCategoryName(post.data.category) : '',
pubDate: post.data.pubDate.toISOString(),
image: post.data.heroImage ?? '',
body: stripMarkdown(post.body ?? ''),
}));

return new Response(JSON.stringify(docs), {
  headers: { 'Content-Type': 'application/json' },
});
};
