import type { UserEvent } from "@testing-library/user-event";

import { clickSelectFieldOption } from "~/components/fields/SelectField.testHelper";

/**
 * Test helper to select a reviewed status filter option.
 * @param user - UserEvent instance for interactions
 * @param reviewedStatus - The reviewed status option to select
 */
export async function clickReviewedStatusFilterOption(
  user: UserEvent,
  reviewedStatus: "All" | "Not Reviewed" | "Reviewed",
) {
  await clickSelectFieldOption(user, "Reviewed Status", reviewedStatus);
}
