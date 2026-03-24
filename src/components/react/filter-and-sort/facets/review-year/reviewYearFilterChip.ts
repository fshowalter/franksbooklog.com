import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildYearRangeChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { REVIEW_YEAR_CHIP_ID } from "./reviewYearChipId";

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
