import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Test helper function to click the "Clear all filters" button.
 *
 * @param user - User event instance for interaction simulation
 */
export async function clickClearFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Clear all filters" }));
}

/**
 * Test helper function to click the "Close filters" button.
 *
 * @param user - User event instance for interaction simulation
 */
export async function clickCloseFilters(user: UserEvent) {
  // Close the drawer with the X button (should reset pending changes)
  await user.click(screen.getByRole("button", { name: "Close filters" }));
}

/**
 * Test helper function to select a sort option.
 *
 * @param user - User event instance for interaction simulation
 * @param sortText - The sort option text to select
 */
export async function clickSortOption(user: UserEvent, sortText: string) {
  await user.selectOptions(screen.getByLabelText("Sort"), sortText);
}

/**
 * Test helper function to click the "Toggle filters" button.
 *
 * @param user - User event instance for interaction simulation
 */
export async function clickToggleFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Toggle filters" }));
}

/**
 * Test helper function to click the "View Results" button.
 *
 * @param user - User event instance for interaction simulation
 */
export async function clickViewResults(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));
}
