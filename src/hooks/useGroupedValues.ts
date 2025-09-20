/**
 * Hook that filters, sorts, and groups values with memoization.
 * @param sorter - Function to sort values
 * @param filterer - Function to filter values
 * @param grouper - Function to group values
 * @param values - Array of values to process
 * @param sort - Current sort configuration
 * @param activeFilterValues - Current filter configuration
 * @returns Tuple of grouped values map and total count
 */
export function useGroupedValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  grouper: (values: TValue[], sort: TSort) => Map<string, TValue[]>,
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
): [Map<string, TValue[]>, number] {
  "use memo";
  const sortedValues = sorter(values, sort);
  const filteredValues = filterer(sortedValues, activeFilterValues);
  const newGroupedValues = grouper(filteredValues, sort);

  return [newGroupedValues, filteredValues.length];
}
