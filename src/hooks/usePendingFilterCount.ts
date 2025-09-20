/**
 * Hook that calculates the count of items after applying pending filters.
 * @param filterer - Function to filter values
 * @param values - Array of values to filter
 * @param pendingFilterValues - Pending filter configuration
 * @returns Count of items after applying pending filters
 */
export function usePendingFilterCount<TValue, TFilterValues>(
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  pendingFilterValues: TFilterValues,
): number {
  "use memo";
  const filteredValues = filterer(values, pendingFilterValues);

  return filteredValues.length;
}
