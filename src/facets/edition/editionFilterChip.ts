import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort/filterChipBuilders";

export const EDITION_CHIP_ID_PREFIX = "edition" as const;

export function buildEditionFilterChip(
  edition: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(edition, "Edition", EDITION_CHIP_ID_PREFIX);
}
