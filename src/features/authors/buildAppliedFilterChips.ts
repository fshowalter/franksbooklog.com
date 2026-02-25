import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";
import { buildSearchChip } from "~/components/filter-and-sort/filterChipBuilders";

import type { AuthorsFiltersValues } from "./Authors.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorsFiltersValues,
): FilterChip[] {
  return [...buildSearchChip(filterValues.name, "name")];
}
