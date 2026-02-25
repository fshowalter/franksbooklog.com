// AIDEV-NOTE: abandoned: boolean is a computed field added at the props layer.
// For reviews/author-titles: abandoned = grade === "Abandoned".
// For reading-log: abandoned = progress === "Abandoned".
// The filter does not depend on the raw progress string or grade string.
type FilterableMaybeReviewedTitle = {
  abandoned: boolean;
  reviewed?: boolean;
};

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
    let status: string;
    if (value.abandoned) {
      status = "Abandoned";
    } else {
      status = value.reviewed ? "Reviewed" : "Not Reviewed";
    }
    return filterValue.includes(status);
  };
}
