import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildYearRangeChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { READING_YEAR_CHIP_ID } from "./readingYearChipId";

export function buildReadingYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReadingYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctReadingYears,
    "Reading Year",
    READING_YEAR_CHIP_ID,
  );
}
