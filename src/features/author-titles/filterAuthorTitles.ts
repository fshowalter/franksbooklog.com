import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createGradeFilter } from "~/components/filter-and-sort/facets/grade/gradeFilter";
import { createKindFilter } from "~/components/filter-and-sort/facets/kind/kindFilter";
import { createReviewYearFilter } from "~/components/filter-and-sort/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleYearFilter } from "~/components/filter-and-sort/facets/title-year/titleYearFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";

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
  sortedValues: readonly AuthorTitlesValue[],
  filterValues: AuthorTitlesFiltersValues,
) {
  const filters = [
    createGradeFilter(filterValues),
    createKindFilter(filterValues),
    createReviewYearFilter(filterValues),
    createReviewedStatusFilter(filterValues),
    createTitleFilter(filterValues),
    createTitleYearFilter(filterValues),
  ].filter((f) => f !== undefined);
  return filterSortedValues({ filters, sortedValues });
}
