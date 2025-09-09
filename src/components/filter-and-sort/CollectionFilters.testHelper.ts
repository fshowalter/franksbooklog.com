import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextField } from "~/components/fields/TextField.testHelper";

/**
 * Test helper function to fill the name filter field.
 * 
 * @param user - User event instance for interaction simulation
 * @param value - The name text to enter
 */
export async function fillNameFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Name", value);
}

/**
 * Test helper function to get the name filter element.
 * 
 * @returns The name filter DOM element
 */
export function getNameFilter() {
  return screen.getByLabelText("Name");
}
