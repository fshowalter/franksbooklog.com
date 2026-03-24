import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildSearchChip } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { TITLE_CHIP_ID } from "./titleChipId";

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip(title, TITLE_CHIP_ID);
}
