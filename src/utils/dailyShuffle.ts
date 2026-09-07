// Deterministically shuffles `items` and returns the first `count`.
// The shuffle is seeded by today's date (UTC, YYYY-MM-DD), so:
// - The result is 100% stable for every request within the same build/day
//   (no hydration mismatch, no flicker, safe for SSG caching).
// - It naturally rotates the next time the site is rebuilt on a new day.
// If there are fewer items than `count`, all items are returned unshuffled
// order-preserved-by-recency so no empty placeholder cards are ever needed.
export function dailyPick<T>(items: T[], count: number): T[] {
  	if (items.length <= count) return items;

  	const seedStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  	let state = Number(seedStr) % 2147483647;
  	if (state <= 0) state += 2147483646;

  	// Lehmer / Park-Miller PRNG — small, dependency-free, deterministic.
  	function next() {
      		state = (state * 16807) % 2147483647;
      		return (state - 1) / 2147483646;
    }

  	const arr = [...items];
  	for (let i = arr.length - 1; i > 0; i--) {
      		const j = Math.floor(next() * (i + 1));
      		[arr[i], arr[j]] = [arr[j], arr[i]];
    }
  	return arr.slice(0, count);
}
