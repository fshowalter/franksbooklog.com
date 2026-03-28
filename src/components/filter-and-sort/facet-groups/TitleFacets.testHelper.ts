import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextField } from "~/components/filter-and-sort/fields/TextField.testHelper";

/**
 * Test helper function to fill the title filter field.
 *
 * @param user - User event instance for interaction simulation
 * @param value - The title text to enter
 */
export async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

/**
 * Test helper function to get the kind filter fieldset element.
 *
 * @returns The kind filter fieldset DOM element
 */
export function getKindFilter() {
  return screen.getByRole("group", { name: "Kind" });
}

/**
 * Test helper function to get the title filter element.
 *
 * @returns The title filter DOM element
 */
export function getTitleFilter() {
  return screen.getByLabelText("Title");
}
