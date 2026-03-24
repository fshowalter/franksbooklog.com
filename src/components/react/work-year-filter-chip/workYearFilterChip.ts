import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildYearRangeChip } from "~/components/react/filter-and-sort-container/filterChipBuilders";
import { WORK_YEAR_CHIP_ID } from "~/facets/work-year/workYearChipId";

export function buildWorkYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctWorkYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctWorkYears,
    "Work Year",
    WORK_YEAR_CHIP_ID,
  );
}
