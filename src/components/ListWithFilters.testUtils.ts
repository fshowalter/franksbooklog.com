import type { UserEvent } from "@testing-library/user-event";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { DRAWER_CLOSE_ANIMATION_MS } from "~/components/ListWithFilters";

export async function clickClearFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Clear all filters" }));
}

export async function clickCloseFilters(user: UserEvent) {
  // Close the drawer with the X button (should reset pending changes)
  await user.click(screen.getByRole("button", { name: "Close filters" }));

  // Wait for drawer close animation
  act(() => {
    vi.advanceTimersByTime(DRAWER_CLOSE_ANIMATION_MS);
  });
}

export async function clickToggleFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Toggle filters" }));
}

export async function clickViewResults(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));
  // Wait for drawer close animation
  act(() => {
    vi.advanceTimersByTime(DRAWER_CLOSE_ANIMATION_MS);
  });
}
