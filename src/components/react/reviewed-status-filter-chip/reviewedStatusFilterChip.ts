import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildMultiSelectChips } from "~/components/react/filter-and-sort-container/filterChipBuilders";
import { REVIEWED_STATUS_CHIP_ID_PREFIX } from "~/facets/reviewed-status/reviewedStatusChipId";

export function buildReviewedStatusFilterChip(
  reviewedStatus: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(
    reviewedStatus,
    "Status",
    REVIEWED_STATUS_CHIP_ID_PREFIX,
  );
}
