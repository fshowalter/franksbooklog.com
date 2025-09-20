import { useState } from "react";

/**
 * Hook that filters and sorts values with memoization.
 * @param sorter - Function to sort values
 * @param filterer - Function to filter values
 * @param values - Array of values to process
 * @param sort - Current sort configuration
 * @param activeFilterValues - Current filter configuration
 * @returns Filtered and sorted values
 */
export function useFilteredValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
): TValue[] {
  const [currentSort, setSort] = useState<TSort>();
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [filteredValues, setFilteredValues] = useState<TValue[]>([]);

  if (
    Object.is(currentSort, sort) &&
    Object.is(currentFilterValues, activeFilterValues)
  ) {
    return filteredValues;
  }

  setSort(sort);
  setFilterValues(activeFilterValues);

  const sortedValues = sorter(values, sort);
  const newFilteredValues = filterer(sortedValues, activeFilterValues);
  setFilteredValues(newFilteredValues);

  return newFilteredValues;
}
