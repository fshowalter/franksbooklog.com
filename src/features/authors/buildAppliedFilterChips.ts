import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildNameFilterChip } from "~/components/filter-and-sort/facets/name/nameFilterChip";

import type { AuthorsFiltersValues } from "./Authors.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorsFiltersValues,
): FilterChip[] {
  return [...buildNameFilterChip(filterValues.name)];
}
