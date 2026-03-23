import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort/filterChipBuilders";

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip(title, "title");
}
