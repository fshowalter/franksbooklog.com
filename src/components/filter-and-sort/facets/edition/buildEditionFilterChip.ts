import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./editionReducer";

export function buildEditionFilterChip(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({
    key: STATE_KEY,
    values,
  });
}
