import { screen } from "@testing-library/react";

/**
 * Test helper function to get the grouped avatar list element.
 * Returns the container element for grouped avatar list components.
 * 
 * @returns The grouped avatar list DOM element
 */
export function getGroupedAvatarList() {
  return screen.getByTestId("grouped-avatar-list");
}
