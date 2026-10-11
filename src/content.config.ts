import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		keywords: z.array(z.string()).optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		// Category slug, see CATEGORIES in ../consts.ts. Optional so existing
		// posts without a category keep working.
		category: z.string().optional(),
		// Articles explicitly marked false stay in the latest list but are
		// excluded from the homepage featured carousel.
		featured: z.boolean().optional(),
		// Optional short vertical video (e.g. 9:16 mp4) shown between the title
		// block and the article body. Not every post has one.
		video: z.string().optional(),
		// Optional article audio narration (human-read or AI-read MP3). The
		// player only renders when `enabled` is true AND `url` is set; any
		// other combination falls back to the normal, audio-less layout.
		audio: z
			.object({
				enabled: z.boolean().optional(),
				// 'human' = 真人講述, 'ai' = AI 語音朗讀
				type: z.enum(['human', 'ai']).optional(),
				// Falls back to the article title when omitted.
				title: z.string().optional(),
				// MP3 URL - can be a Cloudflare R2 public URL, or any other
				// valid https URL. Not validated as a URL so relative /public
				// paths also work during local development.
				url: z.string().optional(),
			})
			.optional(),
	}),
});

export const collections = { blog };
