import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildSearchChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./titleReducer";

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip({ key: STATE_KEY, value: title });
}
