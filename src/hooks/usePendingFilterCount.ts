import { useState } from "react";

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
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [pendingFilterCount, setPendingFilterCount] = useState<number>(0);

  if (Object.is(currentFilterValues, pendingFilterValues)) {
    return pendingFilterCount;
  }

  setFilterValues(pendingFilterValues);

  const filteredValues = filterer(values, pendingFilterValues);
  setPendingFilterCount(filteredValues.length);

  return filteredValues.length;
}
