import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { AuthorsFiltersValues } from "./Authors.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Authors page.
 *
 * @param filterValues - Active filter values (from state.activeFilterValues)
 * @returns Array of FilterChip objects representing active filters
 */
export function buildAppliedFilterChips(
  filterValues: AuthorsFiltersValues,
): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filterValues.name?.trim()) {
    chips.push({
      category: "Search",
      id: "name",
      label: filterValues.name,
    });
  }

  return chips;
}
