import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildMultiSelectChips } from "~/components/filter-and-sort/filterChipBuilders";

export function buildReviewedStatusFilterChip(
  reviewedStatus: readonly string[] | undefined,
): FilterChip[] {
  return buildMultiSelectChips(reviewedStatus, "Status", "reviewedStatus");
}
