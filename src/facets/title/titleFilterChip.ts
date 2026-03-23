import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort/filterChipBuilders";

export const TITLE_CHIP_ID = "title" as const;

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip(title, TITLE_CHIP_ID);
}
