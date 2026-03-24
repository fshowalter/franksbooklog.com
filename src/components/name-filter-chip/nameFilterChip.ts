import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort-container/filterChipBuilders";
import { NAME_CHIP_ID } from "~/facets/name/nameChipId";

export function buildNameFilterChip(name: string | undefined): FilterChip[] {
  return buildSearchChip(name, NAME_CHIP_ID);
}
