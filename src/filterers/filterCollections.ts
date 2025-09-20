import type { CollectionFiltersValues } from "~/reducers/collectionFiltersReducer";

import { filterSortedValues } from "./filterSortedValues";

type FilterableCollection = {
  name: string;
};

/**
 * Filters an array of collections based on name and custom filter criteria.
 * @param filterValues - Object containing filter values, primarily name filter
 * @param sortedValues - Array of collections to filter
 * @param extraFilters - Additional custom filter functions to apply
 * @returns Filtered array of collections matching all filter criteria
 */
export function filterCollections<TValue extends FilterableCollection>(
  filterValues: CollectionFiltersValues,
  sortedValues: TValue[],
  extraFilters: ((value: TValue) => boolean)[],
) {
  const filters: ((value: TValue) => boolean)[] = [
    createNameFilter(filterValues.name),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}

function createNameFilter<TValue extends FilterableCollection>(
  filterValue?: string,
) {
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean => regex.test(value.name);
}
