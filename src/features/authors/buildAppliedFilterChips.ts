import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildNameFilterChip } from "~/components/react/name-filter-chip/nameFilterChip";

import type { AuthorsFiltersValues } from "./Authors.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorsFiltersValues,
): FilterChip[] {
  return [...buildNameFilterChip(filterValues.name)];
}
