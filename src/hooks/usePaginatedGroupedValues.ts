import { useState } from "react";

/**
 * Hook that filters, sorts, groups, and paginates values with memoization.
 * @param sorter - Function to sort values
 * @param filterer - Function to filter values
 * @param grouper - Function to group values with pagination
 * @param values - Array of values to process
 * @param sort - Current sort configuration
 * @param activeFilterValues - Current filter configuration
 * @param showCount - Number of items to show
 * @returns Tuple of grouped values map and total count
 */
export function usePaginatedGroupedValues<TValue, TSort, TFilterValues>(
  sorter: (values: TValue[], sort: TSort) => TValue[],
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  grouper: (
    values: TValue[],
    sort: TSort,
    showCount: number,
  ) => Map<string, TValue[]>,
  values: TValue[],
  sort: TSort,
  activeFilterValues: TFilterValues,
  showCount: number,
): [Map<string, TValue[]>, number] {
  const [currentSort, setSort] = useState<TSort>();
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [currentShowCount, setShowCount] = useState<number>();
  const [groupedValues, setGroupedValues] = useState<Map<string, TValue[]>>(
    new Map<string, TValue[]>(),
  );
  const [totalCount, setTotalCount] = useState<number>(0);

  if (
    Object.is(currentSort, sort) &&
    Object.is(currentFilterValues, activeFilterValues) &&
    Object.is(currentShowCount, showCount)
  ) {
    return [groupedValues, totalCount];
  }

  setSort(sort);
  setFilterValues(activeFilterValues);
  setShowCount(showCount);

  const sortedValues = sorter(values, sort);
  const filteredValues = filterer(sortedValues, activeFilterValues);
  const newGroupedValues = grouper(filteredValues, sort, showCount);
  setGroupedValues(newGroupedValues);
  setTotalCount(filteredValues.length);

  return [newGroupedValues, filteredValues.length];
}
