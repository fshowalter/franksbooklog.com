import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort/filterChipBuilders";

export function buildEditionFilterChip(
  edition: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(edition, "Edition", "edition");
}
