/**
 * Converts a label value to a URL-safe chip ID slug.
 * Used by chip builders to generate IDs and by array facet reducers
 * to reverse-match chip IDs back to label values.
 */
export function toChipSlug(value: string): string {
  return value.toLowerCase().replaceAll(" ", "-");
}
