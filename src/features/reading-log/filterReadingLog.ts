import { createReviewedStatusFilter } from "~/filterers/createReviewedStatusFilter";
import { createTitleFilter } from "~/filterers/createTitleFilter";
import { createWorkYearFilter } from "~/filterers/createWorkYearFilter";
import { filterSortedValues } from "~/filterers/filterSortedValues";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

/**
 * Filters viewings based on multiple criteria including venue, medium, and viewing year.
 * @param sortedValues - Array of viewings to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of viewings
 */
export function filterReadingLog(
  sortedValues: ReadingLogValue[],
  filterValues: ReadingLogFiltersValues,
) {
  const filters = [
    createReviewedStatusFilter(filterValues.reviewedStatus),
    createReadingYearFilter(filterValues.readingYear),
    createEditionFilter(filterValues.edition),
    createKindFilter(filterValues.kind),
    createTitleFilter(filterValues.title),
    createWorkYearFilter(filterValues.workYear),
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}

function createEditionFilter(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: ReadingLogValue) => filterValue.includes(value.edition);
}

function createKindFilter(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: ReadingLogValue) => filterValue.includes(value.kind);
}

function createReadingYearFilter(filterValue?: [string, string]) {
  if (!filterValue) return;
  return (value: ReadingLogValue): boolean => {
    return (
      value.readingYear >= filterValue[0] && value.readingYear <= filterValue[1]
    );
  };
}
