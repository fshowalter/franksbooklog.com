import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort/facets/filterChipBuilders";

import { REVIEWED_STATUS_CHIP_ID_PREFIX } from "./reviewedStatusChipId";

export function buildReviewedStatusFilterChip(
  reviewedStatus: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(
    reviewedStatus,
    "Status",
    REVIEWED_STATUS_CHIP_ID_PREFIX,
  );
}
