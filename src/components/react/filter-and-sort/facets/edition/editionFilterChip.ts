import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { EDITION_CHIP_ID_PREFIX } from "./editionChipId";

export function buildEditionFilterChip(
  edition: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(edition, "Edition", EDITION_CHIP_ID_PREFIX);
}
