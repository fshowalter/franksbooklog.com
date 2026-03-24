import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { KIND_CHIP_ID_PREFIX } from "./kindChipId";

export function buildKindFilterChip(
  kind: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(kind, "Kind", KIND_CHIP_ID_PREFIX);
}
