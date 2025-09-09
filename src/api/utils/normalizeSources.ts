const regex = new RegExp(/(\/_image\/\?href=%2F)(.*?)(?=content)/gm);

/**
 * Normalizes image source URLs for consistent testing environments.
 * In test mode, removes dynamic parts from image URLs to ensure
 * stable snapshots and predictable test outputs.
 * 
 * @param sources - HTML string containing image sources to normalize
 * @returns HTML string with normalized image sources (in test mode) or original string
 * 
 * @example
 * ```typescript
 * const html = '<img src="/_image/?href=%2Fcontent/covers/book.jpg">';
 * const normalized = normalizeSources(html);
 * // In test mode: '<img src="/_image/?href=%2F">'
 * // In other modes: original string unchanged
 * ```
 */
export function normalizeSources(sources: string): string {
  if (import.meta.env.MODE === "test") {
    return sources.replaceAll(regex, "$1");
  }
  return sources;
}
