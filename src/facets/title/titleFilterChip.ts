import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort-container/filterChipBuilders";

import { TITLE_CHIP_ID } from "./titleChipId";

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip(title, TITLE_CHIP_ID);
}
