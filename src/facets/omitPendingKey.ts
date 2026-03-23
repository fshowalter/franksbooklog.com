/**
 * Returns a copy of `pendingFilterValues` with the given key omitted.
 * Used by facet reducers to delete a filter key rather than setting it to
 * undefined, so that selectHasPendingFilters correctly returns false when no
 * effective filters remain.
 */
export function omitPendingKey<TValues extends Record<string, unknown>>(
  pendingFilterValues: TValues,
  key: keyof TValues & string,
): TValues {
  return Object.fromEntries(
    Object.entries(pendingFilterValues).filter(([k]) => k !== key),
  ) as TValues;
}
