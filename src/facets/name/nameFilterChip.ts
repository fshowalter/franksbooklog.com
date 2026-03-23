import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort/filterChipBuilders";

export const NAME_CHIP_ID = "name" as const;

export function buildNameFilterChip(name: string | undefined): FilterChip[] {
  return buildSearchChip(name, NAME_CHIP_ID);
}
