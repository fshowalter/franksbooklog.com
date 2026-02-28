// AIDEV-NOTE: abandoned: boolean is a computed field added at the props layer.
// For reviews/author-titles: abandoned = grade === "Abandoned".
// For reading-log: abandoned = progress === "Abandoned".
// The filter does not depend on the raw progress string or grade string.
type FilterableMaybeReviewedTitle = {
  abandoned: boolean;
  reviewed?: boolean;
};

/**
 * Counts items by reviewed status ("Reviewed", "Not Reviewed", "Abandoned").
 * Uses the same classification logic as createReviewedStatusFilter.
 * @param values - Array of items to count
 * @returns Map from status string to item count
 */
export function createReviewedStatusCountMap<
  TValue extends FilterableMaybeReviewedTitle,
>(values: readonly TValue[]): Map<string, number> {
  const counts = new Map<string, number>([
    ["Abandoned", 0],
    ["Not Reviewed", 0],
    ["Reviewed", 0],
  ]);
  for (const value of values) {
    const status = getStatus(value);
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }
  return counts;
}

/**
 * Creates a filter function for reviewed/unreviewed/abandoned status (multi-select OR).
 * @param filterValue - Array of status strings to match
 * @returns Filter function or undefined if no filter value
 */
export function createReviewedStatusFilter<
  TValue extends FilterableMaybeReviewedTitle,
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue): boolean => {
    return filterValue.includes(getStatus(value));
  };
}

function getStatus(value: FilterableMaybeReviewedTitle): string {
  if (value.abandoned) return "Abandoned";
  return value.reviewed ? "Reviewed" : "Not Reviewed";
}
