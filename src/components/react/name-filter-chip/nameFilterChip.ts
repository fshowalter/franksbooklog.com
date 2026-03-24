import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildSearchChip } from "~/components/react/filter-and-sort-container/filterChipBuilders";
import { NAME_CHIP_ID } from "~/facets/name/nameChipId";

export function buildNameFilterChip(name: string | undefined): FilterChip[] {
  return buildSearchChip(name, NAME_CHIP_ID);
}
