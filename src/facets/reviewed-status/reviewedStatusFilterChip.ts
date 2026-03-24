import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort-container/filterChipBuilders";

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
