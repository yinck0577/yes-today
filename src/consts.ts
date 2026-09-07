// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Yes Today";
export const SITE_DESCRIPTION = "Yes Today 整理生活、政策、消費權益與科技新聞，把複雜消息轉成看得懂、用得上的行動指南。";

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
	{ slug: "arts", name: "藝文" },
	{ slug: "sports", name: "運動" },
	{ slug: "entertainment", name: "娛樂" },
		// Evergreen, non-time-sensitive content (world oddities, urban legends,
		// trivia, etc.) surfaced via the homepage "奇聞軼事" bar. Posts are still
		// normal blog entries; this is just a category slug like any other.
	{ slug: "oddities", name: "奇聞軼事" },
	];

export function getCategoryName(slug: string) {
		const found = CATEGORIES.find((c) => c.slug === slug);
		return found ? found.name : slug;
}
