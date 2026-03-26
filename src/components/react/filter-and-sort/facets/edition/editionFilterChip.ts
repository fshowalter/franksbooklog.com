import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./editionReducer";

export function buildEditionFilterChip(
  values: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips({
    key: STATE_KEY,
    values,
  });
}
