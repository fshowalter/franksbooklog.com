import type { UserEvent } from "@testing-library/user-event";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { TEXT_FILTER_DEBOUNCE_MS } from "./TextField";

/**
 * Test helper function to fill a text field with debounced input.
 * Types the given value into a text field and advances timers to trigger
 * the debounced onChange callback.
 *
 * @param user - User event instance for interaction simulation
 * @param labelText - Label text to locate the text field by
 * @param value - Text value to type into the field
 */
export async function fillTextField(
  user: UserEvent,
  labelText: string,
  value: string,
) {
  // Apply multiple filters
  await user.type(screen.getByLabelText(labelText), value);
  act(() => {
    vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
  });
}
