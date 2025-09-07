import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

export function getUserWithFakeTimers() {
  return userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
}
