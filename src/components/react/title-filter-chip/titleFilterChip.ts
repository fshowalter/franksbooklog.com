import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildSearchChip } from "~/components/react/filter-and-sort-container/filterChipBuilders";
import { TITLE_CHIP_ID } from "~/facets/title/titleChipId";

export function buildTitleFilterChip(title: string | undefined): FilterChip[] {
  return buildSearchChip(title, TITLE_CHIP_ID);
}
