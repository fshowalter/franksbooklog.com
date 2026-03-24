import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildSearchChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { NAME_CHIP_ID } from "./nameChipId";

export function buildNameFilterChip(name: string | undefined): FilterChip[] {
  return buildSearchChip(name, NAME_CHIP_ID);
}
