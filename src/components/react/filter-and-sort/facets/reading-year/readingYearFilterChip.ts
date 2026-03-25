import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildYearRangeChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./readingYearReducer";

export function buildReadingYearFilterChip(
  value: readonly [string, string] | undefined,
): FilterChip[] {
  return buildYearRangeChip({
    key: STATE_KEY,
    label: "Reading Year",
    value,
  });
}
