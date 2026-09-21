import { normalizeText } from './textNormalize';
import { expandQueryWithSynonyms } from '../config/searchSynonyms';

export interface SearchDoc {
	slug: string;
  	title: string;
    	description: string;
      	category: string;
        	categoryName: string;
          	pubDate: string; // ISO 8601
            	image: string;
              	body: string; // plain text, markdown/HTML already stripped
                }

                export interface SearchResult {
                	doc: SearchDoc;
                  	score: number;
                    	matchedFields: string[];
                      }

                      // Relevance weights per field. No `keywords`/`tags` entries exist here
                      // because the current blog content schema (src/content.config.ts) has no
                      // such frontmatter fields — see the search feature report for details.
                      const FIELD_WEIGHTS: Array<{ field: keyof SearchDoc; weight: number }> = [
                      	{ field: 'title', weight: 5 },
                        	{ field: 'category', weight: 3 },
                          	{ field: 'categoryName', weight: 3 },
                            	{ field: 'description', weight: 3 },
                              	{ field: 'body', weight: 2 },
                                ];

                                function countOccurrences(haystack: string, needle: string): number {
                                	if (!needle) return 0;
                                  	let count = 0;
                                    	let idx = 0;
                                      	while (true) {
                                        		idx = haystack.indexOf(needle, idx);
                                            		if (idx === -1) break;
                                                		count += 1;
                                                    		idx += needle.length;
                                                        	}
                                                          	return count;
                                                            }

                                                            /**
                                                             * Scores and ranks `docs` against `rawQuery`.
                                                              * - Relevance first (weighted field matches, synonym-expanded), then
                                                               *   published date (newer first) as the tiebreaker — never date-only.
                                                                * - A doc only appears if at least one field actually matched.
                                                                 */
                                                                 export function search(docs: SearchDoc[], rawQuery: string, limit = 50): SearchResult[] {
                                                                 	const normalizedQuery = normalizeText(rawQuery);
                                                                  	if (!normalizedQuery) return [];
                                                                    	const variants = expandQueryWithSynonyms(normalizedQuery);

                                                                      	const results: SearchResult[] = [];
                                                                        	for (const doc of docs) {
                                                                          		let score = 0;
                                                                              		const matchedFields: string[] = [];
                                                                                  		for (const { field, weight } of FIELD_WEIGHTS) {
                                                                                      			const raw = String((doc as any)[field] ?? '');
                                                                                            			if (!raw) continue;
                                                                                                  			const normalizedField = normalizeText(raw);
                                                                                                        			let occurrences = 0;
                                                                                                              			for (const variant of variants) {
                                                                                                                    				occurrences += countOccurrences(normalizedField, variant);
                                                                                                                            			}
                                                                                                                                  			if (occurrences > 0) {
                                                                                                                                        				score += occurrences * weight;
                                                                                                                                                				matchedFields.push(field as string);
                                                                                                                                                        			}
                                                                                                                                                              		}
                                                                                                                                                                  		if (score > 0) {
                                                                                                                                                                      			results.push({ doc, score, matchedFields });
                                                                                                                                                                            		}
                                                                                                                                                                                	}
                                                                                                                                                                                  
                                                                                                                                                                                  	results.sort((a, b) => {
                                                                                                                                                                                    		if (b.score !== a.score) return b.score - a.score;
                                                                                                                                                                                        		return new Date(b.doc.pubDate).getTime() - new Date(a.doc.pubDate).getTime();
                                                                                                                                                                                            	});
                                                                                                                                                                                              
                                                                                                                                                                                              	return results.slice(0, limit);
                                                                                                                                                                                                }
                                                                                                                                                                                                
