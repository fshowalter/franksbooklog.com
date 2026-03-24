import { filterSortedValues } from "~/components/react/filter-and-sort/facets/filterSortedValues";
import { createGradeFilter } from "~/components/react/filter-and-sort/facets/grade/gradeFilter";
import { createKindFilter } from "~/components/react/filter-and-sort/facets/kind/kindFilter";
import { createReviewYearFilter } from "~/components/react/filter-and-sort/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/components/react/filter-and-sort/facets/title/titleFilter";
import { createTitleYearFilter } from "~/components/react/filter-and-sort/facets/title-year/titleYearFilter";

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
    createTitleYearFilter(filterValues.workYear),
  ].filter((f) => f !== undefined);
  return filterSortedValues({ filters, sortedValues });
}
