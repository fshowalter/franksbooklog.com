import { createEditionFilter } from "~/facets/edition/editionFilter";
import { createKindFilter } from "~/facets/kind/kindFilter";
import { createReadingYearFilter } from "~/facets/reading-year/readingYearFilter";
import { createReviewedStatusFilter } from "~/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/facets/title/titleFilter";
import { createWorkYearFilter } from "~/facets/work-year/workYearFilter";
import { filterSortedValues } from "~/filterers/filterSortedValues";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

/**
 * Filters reading log entries based on edition, kind, reading year, reviewed
 * status, title, and work year.
 * @param sortedValues - Array of reading log entries to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reading log entries
 */
export function filterReadingLog(
  sortedValues: ReadingLogValue[],
  filterValues: ReadingLogFiltersValues,
) {
  const filters = [
    createEditionFilter(filterValues.edition),
    createKindFilter(filterValues.kind),
    createReadingYearFilter(filterValues.readingYear),
    createReviewedStatusFilter(filterValues.reviewedStatus),
    createTitleFilter(filterValues.title),
    createWorkYearFilter(filterValues.workYear),
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}
