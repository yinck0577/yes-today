// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Yes Today";
export const SITE_DESCRIPTION = "掌握健康新知，每天多懂一點。";

// Site categories, modeled after CNA (中央社) style news classification.
// Each post can be tagged with one of these category slugs in its frontmatter.
export const CATEGORIES = [
	{ slug: "world", name: "國際" },
	{ slug: "business", name: "產經" },
	{ slug: "tech", name: "科技" },
	{ slug: "life", name: "生活" },
	{ slug: "society", name: "社會" },
	{ slug: "health", name: "健康" },
	{ slug: "pet", name: "寵物" },
	{ slug: "culture", name: "文化" },
	{ slug: "arts", name: "藝文" },
	{ slug: "sports", name: "運動" },
	{ slug: "entertainment", name: "娛樂" },
];

export function getCategoryName(slug: string) {
	const found = CATEGORIES.find((c) => c.slug === slug);
	return found ? found.name : slug;
}
