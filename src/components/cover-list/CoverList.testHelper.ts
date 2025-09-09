import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Test helper function to click the "Show More" button.
 * Simulates user interaction with the pagination button in cover lists.
 * 
 * @param user - User event instance for interaction simulation
 */
export async function clickShowMore(user: UserEvent) {
  await user.click(screen.getByText("Show More"));
}

/**
 * Test helper function to get the grouped cover list element.
 * Returns the container element for grouped cover list components.
 * 
 * @returns The grouped cover list DOM element
 */
export function getGroupedCoverList() {
  return screen.getByTestId("grouped-cover-list");
}
