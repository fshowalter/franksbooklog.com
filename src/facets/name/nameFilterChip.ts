import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildSearchChip } from "~/components/filter-and-sort/filterChipBuilders";

export function buildNameFilterChip(name: string | undefined): FilterChip[] {
  return buildSearchChip(name, "name");
}
