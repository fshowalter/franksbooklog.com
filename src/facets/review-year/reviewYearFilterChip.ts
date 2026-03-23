import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort/filterChipBuilders";

export function buildReviewYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReviewYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctReviewYears,
    "Review Year",
    "reviewYear",
  );
}
