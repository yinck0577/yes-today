// Normalizes text for search matching:
// - Maps Traditional-Chinese character variants (臺 -> 台) so 台北/臺北 are
//   treated as the same term without needing an explicit synonym entry for
//   every place name.
// - Lowercases ASCII so English terms (e.g. "Taihoku") match case-insensitively.
// Apply this to BOTH the search query and the indexed field text before
// comparing, so the two sides always speak the same normalized form.
const VARIANT_MAP: Record<string, string> = {
	臺: '台',
  };

  export function normalizeText(input: string): string {
  	if (!input) return '';
    	let out = '';
      	for (const ch of input) {
        		out += VARIANT_MAP[ch] ?? ch;
            	}
              	return out.toLowerCase().trim();
                }
                
