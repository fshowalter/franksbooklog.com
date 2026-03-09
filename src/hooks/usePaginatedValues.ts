/**
 * Hook that filters, sorts, groups, and paginates values with memoization.
 * @param sorter - Function to sort values
 * @param filterer - Function to filter values
 * @param values - Array of values to process
 * @param sort - Current sort configuration
 * @param activeFilterValues - Current filter configuration
 * @param showCount - Number of items to show
 * @returns Tuple of grouped values map and total count
 */
export function usePaginatedValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
  showCount: number,
): [TValue[], number] {
  "use memo";

  const sortedValues = sorter(values, sort);
  const filteredValues = filterer(sortedValues, activeFilterValues);
  const paginatedValues = filteredValues.slice(0, showCount);

  return [paginatedValues, filteredValues.length];
}
