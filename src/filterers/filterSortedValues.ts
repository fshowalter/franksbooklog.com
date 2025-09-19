/**
 * Applies multiple filter functions to a sorted array of values.
 * All filters must pass for a value to be included in the result.
 * @param options - Configuration object
 * @param options.filters - Array of filter predicate functions
 * @param options.sortedValues - Array of values to filter
 * @returns Filtered array containing only values that pass all filters
 */
export function filterSortedValues<TValue>({
  filters,
  sortedValues,
}: {
  filters: ((value: TValue) => boolean)[];
  sortedValues: readonly TValue[];
}): TValue[] {
  return sortedValues.filter((value) => {
    return filters.every((filter) => {
      return filter(value);
    });
  });
}
