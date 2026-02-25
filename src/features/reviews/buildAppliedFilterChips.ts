import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";
import {
  buildGradeChip,
  buildMultiSelectChips,
  buildSearchChip,
  buildYearRangeChip,
} from "~/components/filter-and-sort/filterChipBuilders";

import type { ReviewsFiltersValues } from "./Reviews.reducer";

export function buildAppliedFilterChips(
  filterValues: ReviewsFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReviewYears: readonly string[],
): FilterChip[] {
  return [
    ...buildSearchChip(filterValues.title, "title"),
    ...buildMultiSelectChips(filterValues.kind, "Kind", "kind"),
    ...buildYearRangeChip(
      filterValues.workYear,
      distinctWorkYears,
      "Work Year",
      "workYear",
    ),
    ...buildGradeChip(filterValues.gradeValue),
    ...buildYearRangeChip(
      filterValues.reviewYear,
      distinctReviewYears,
      "Review Year",
      "reviewYear",
    ),
    ...buildMultiSelectChips(
      filterValues.reviewedStatus,
      "Status",
      "reviewedStatus",
    ),
  ];
}
