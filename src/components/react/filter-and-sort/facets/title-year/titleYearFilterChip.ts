import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildYearRangeChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { TITLE_YEAR_CHIP_ID } from "./titleYearChipId";

export function buildTitleYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctTitleYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctTitleYears,
    "Work Year",
    TITLE_YEAR_CHIP_ID,
  );
}
