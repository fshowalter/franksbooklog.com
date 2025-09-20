type FilterableMaybeReviewedTitle = {
  reviewed?: boolean;
};

/**
 * Creates a filter function for reviewed/unreviewed status.
 * @param filterValue - Filter value ("Reviewed" or "Unreviewed")
 * @returns Filter function or undefined if no filter value
 */
export function createReviewedStatusFilter<
  TValue extends FilterableMaybeReviewedTitle,
>(filterValue?: string) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    if (filterValue === "Reviewed") {
      return Boolean(value.reviewed);
    }

    return !value.reviewed;
  };
}
