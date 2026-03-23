import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort-container/filterChipBuilders";

export const TITLE_CHIP_ID = "title" as const;

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip(title, TITLE_CHIP_ID);
}
