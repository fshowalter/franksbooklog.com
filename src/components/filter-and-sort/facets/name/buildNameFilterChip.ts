import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildSearchChip } from "~/components/filter-and-sort/facets/filterChipBuilders";

import { STATE_KEY } from "./nameReducer";

export function buildNameFilterChip(name: string | undefined): FilterChip[] {
  return buildSearchChip({
    key: STATE_KEY,
    value: name,
  });
}
