import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort/filterChipBuilders";

export function buildKindFilterChip(
  kind: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(kind, "Kind", "kind");
}
