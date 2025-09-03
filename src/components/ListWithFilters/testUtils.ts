import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

export async function clickClearFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Clear all filters" }));
}

export async function clickCloseFilters(user: UserEvent) {
  // Close the drawer with the X button (should reset pending changes)
  await user.click(screen.getByRole("button", { name: "Close filters" }));
}

export async function clickToggleFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Toggle filters" }));
}

export async function clickViewResults(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));
}
