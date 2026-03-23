import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort-container/filterChipBuilders";

export const REVIEW_YEAR_CHIP_ID = "reviewYear" as const;

export function buildReviewYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReviewYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctReviewYears,
    "Review Year",
    REVIEW_YEAR_CHIP_ID,
  );
}
