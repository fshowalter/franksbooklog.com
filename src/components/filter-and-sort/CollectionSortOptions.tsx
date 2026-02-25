import type { SortOption } from "./FilterAndSortContainer";

/**
 * Sort options for collection views (authors, etc.).
 */
export const COLLECTION_SORT_OPTIONS: readonly SortOption[] = [
  { label: "Name (A \u2192 Z)", value: "name-asc" },
  { label: "Name (Z \u2192 A)", value: "name-desc" },
  { label: "Review Count (Most First)", value: "review-count-desc" },
  { label: "Review Count (Fewest First)", value: "review-count-asc" },
] as const;
