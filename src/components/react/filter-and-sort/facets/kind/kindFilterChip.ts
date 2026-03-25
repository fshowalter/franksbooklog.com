import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./kindReducer";

export function buildKindFilterChip(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({
    key: STATE_KEY,
    values: values,
  });
}
