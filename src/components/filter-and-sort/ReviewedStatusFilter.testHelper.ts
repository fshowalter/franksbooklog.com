import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Convenience helper to click the "Abandoned" status filter checkbox.
 * @param user - UserEvent instance for interactions
 */
export async function clickAbandonedFilterOption(user: UserEvent) {
  await clickReviewedStatusFilterOption(user, "Abandoned");
}

/**
 * Test helper to click a reviewed status filter checkbox option.
 * Finds the checkbox by its value attribute to avoid matching issues with count text.
 * @param user - UserEvent instance for interactions
 * @param status - The status value to click ("Reviewed", "Not Reviewed", "Abandoned")
 */
export async function clickReviewedStatusFilterOption(
  user: UserEvent,
  status: string,
) {
  const checkboxes = screen.getAllByRole("checkbox");
  const checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === status,
  );
  if (!checkbox) {
    throw new Error(
      `Unable to find status checkbox with value "${status}". Available: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }
  await user.click(checkbox);
}
