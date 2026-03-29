// abandoned: boolean is a computed field added at the props layer.
// For reviews/author-titles: abandoned = grade === "Abandoned".
// For reading-log: abandoned = progress === "Abandoned".
// The filter does not depend on the raw progress string or grade string.
type FilterableMaybeReviewedTitle = {
  abandoned: boolean;
  reviewed?: boolean;
};

export function createReviewedStatusCountMap<
  TValue extends FilterableMaybeReviewedTitle,
  TFilters extends { reviewedStatus?: readonly string[] },
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, reviewedStatus: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>([
    ["Abandoned", 0],
    ["Not Reviewed", 0],
    ["Reviewed", 0],
  ]);

  for (const value of filtered) {
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
