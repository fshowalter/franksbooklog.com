import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildNameFilterChip } from "~/facets/name/nameFilterChip";

import type { AuthorsFiltersValues } from "./Authors.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorsFiltersValues,
): FilterChip[] {
  return [...buildNameFilterChip(filterValues.name)];
}
