import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort-container/filterChipBuilders";
import { KIND_CHIP_ID_PREFIX } from "~/facets/kind/kindChipId";

export function buildKindFilterChip(
  kind: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(kind, "Kind", KIND_CHIP_ID_PREFIX);
}
