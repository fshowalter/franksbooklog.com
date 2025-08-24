import type { UserEvent } from "@testing-library/user-event";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { TEXT_FILTER_DEBOUNCE_MS } from "./TextFilter";

export async function fillTextFilter(
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
