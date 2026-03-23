import { createGradeFilter } from "~/facets/grade/gradeFilter";
import { createKindFilter } from "~/facets/kind/kindFilter";
import { createReviewYearFilter } from "~/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/facets/title/titleFilter";
import { createWorkYearFilter } from "~/facets/work-year/workYearFilter";
import { filterSortedValues } from "~/filterers/filterSortedValues";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

/**
 * Filters author titles based on grade, kind, work year, review year,
 * reviewed status, and title.
 * @param sortedValues - Array of author titles to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of author titles
 */
export function filterAuthorTitles(
  sortedValues: AuthorTitlesValue[],
  filterValues: AuthorTitlesFiltersValues,
) {
  const filters = [
    createGradeFilter(filterValues.gradeValue),
    createKindFilter(filterValues.kind),
    createReviewYearFilter(filterValues.reviewYear),
    createReviewedStatusFilter(filterValues.reviewedStatus),
    createTitleFilter(filterValues.title),
    createWorkYearFilter(filterValues.workYear),
  ].filter((f) => f !== undefined);
  return filterSortedValues({ filters, sortedValues });
}
