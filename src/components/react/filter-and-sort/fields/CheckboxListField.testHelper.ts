import type { UserEvent } from "@testing-library/user-event";

import { within } from "@testing-library/dom";

export async function clickCheckboxListFieldOption(
  element: HTMLElement,
  user: UserEvent,
  value: string,
): Promise<void> {
  const showMore = within(element).queryByRole("button", {
    name: /show more/i,
  });
  if (showMore) await user.click(showMore);
  const checkboxes = within(element).getAllByRole("checkbox");
  const cb = checkboxes.find((c) => (c as HTMLInputElement).value === value);
  if (!cb) throw new Error(`Kind checkbox "${value}" not found`);
  await user.click(cb);
}
