import type { TitleFiltersValues } from "~/reducers/titleFiltersReducer";

import { createTitleFilter } from "./createTitleFilter";
import { createWorkYearFilter } from "./createWorkYearFilter";
import { filterSortedValues } from "./filterSortedValues";

export type FilterableTitle = {
  kind: string;
  title: string;
  workYear: string;
};

/**
 * Filters an array of titles based on multiple filter criteria.
 * @param filterValues - Object containing filter values for genres, release year, and title
 * @param sortedValues - Array of titles to filter
 * @param extraFilters - Additional custom filter functions to apply
 * @returns Filtered array of titles matching all filter criteria
 */
export function filterTitles<TValue extends FilterableTitle>(
  filterValues: TitleFiltersValues,
  sortedValues: TValue[],
  extraFilters: ((value: TValue) => boolean)[],
) {
  const filters: ((value: TValue) => boolean)[] = [
    createKindFilter(filterValues.kind),
    createWorkYearFilter(filterValues.workYear),
    createTitleFilter(filterValues.title),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}

/**
 * Create a Kind filter function (multi-select OR logic)
 */
function createKindFilter<TValue extends FilterableTitle>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => filterValue.includes(value.kind);
}
