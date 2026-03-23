import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort-container/filterChipBuilders";

export const REVIEWED_STATUS_CHIP_ID_PREFIX = "reviewedStatus" as const;

export function buildReviewedStatusFilterChip(
  reviewedStatus: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(
    reviewedStatus,
    "Status",
    REVIEWED_STATUS_CHIP_ID_PREFIX,
  );
}
