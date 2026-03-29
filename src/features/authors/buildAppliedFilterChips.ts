import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildNameFilterChip } from "~/components/filter-and-sort/facets/name/buildNameFilterChip";

import type { AuthorsFiltersValues } from "./authorsReducer";

export function buildAppliedFilterChips(
  filterValues: AuthorsFiltersValues,
): FilterChip[] {
  return [...buildNameFilterChip(filterValues.name)];
}
