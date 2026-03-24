import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort-container/filterChipBuilders";

import { KIND_CHIP_ID_PREFIX } from "./kindChipId";

export function buildKindFilterChip(
  kind: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(kind, "Kind", KIND_CHIP_ID_PREFIX);
}
