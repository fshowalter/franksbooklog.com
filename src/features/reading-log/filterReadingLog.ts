import { createEditionFilter } from "~/components/filter-and-sort/facets/edition/editionFilter";
import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createKindFilter } from "~/components/filter-and-sort/facets/kind/kindFilter";
import { createReadingYearFilter } from "~/components/filter-and-sort/facets/reading-year/readingYearFilter";
import { createReviewedStatusFilter } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleYearFilter } from "~/components/filter-and-sort/facets/title-year/titleYearFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogFiltersValues } from "./readingLogReducer";

/**
 * Filters reading log entries based on edition, kind, reading year, reviewed
 * status, title, and work year.
 * @param sortedValues - Array of reading log entries to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reading log entries
 */
export function filterReadingLog(
  sortedValues: readonly ReadingLogValue[],
  filterValues: ReadingLogFiltersValues,
) {
  const filters = [
    createEditionFilter(filterValues),
    createKindFilter(filterValues),
    createReadingYearFilter(filterValues),
    createReviewedStatusFilter(filterValues),
    createTitleFilter(filterValues),
    createTitleYearFilter(filterValues),
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
