import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createNameFilter } from "~/components/filter-and-sort/facets/name/nameFilter";

import type { AuthorsValue } from "./Authors";
import type { AuthorsFiltersValues } from "./Authors.reducer";

/**
 * Filters authors based on name.
 * @param sortedValues - Array of authors to filter
 * @param filterValues - Object containing filter values including name
 * @returns Filtered array of authors
 */
export function filterAuthors(
  sortedValues: AuthorsValue[],
  filterValues: AuthorsFiltersValues,
) {
  const filters = [createNameFilter(filterValues.name)].filter(
    (f) => f !== undefined,
  );
  return filterSortedValues({ filters, sortedValues });
}
