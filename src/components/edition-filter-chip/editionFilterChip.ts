import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort-container/filterChipBuilders";
import { EDITION_CHIP_ID_PREFIX } from "~/facets/edition/editionChipId";

export function buildEditionFilterChip(
  edition: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(edition, "Edition", EDITION_CHIP_ID_PREFIX);
}
