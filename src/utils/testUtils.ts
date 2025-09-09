import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

/**
 * Creates a userEvent instance configured to work with Vitest fake timers.
 * This utility is essential for testing components that use debounced interactions
 * or timing-dependent behavior in a controlled test environment.
 *
 * @returns Configured userEvent instance with fake timer support
 */
export function getUserWithFakeTimers() {
  return userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
}
