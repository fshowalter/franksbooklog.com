import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextField } from "~/components/fields/TextField.testHelper";
import { fillYearField } from "~/components/fields/YearField.testHelper";

/**
 * Test helper function to click a kind filter checkbox option.
 * Finds the checkbox by its value attribute (not accessible name) to avoid
 * matching issues with count text appended to labels e.g. "Novel (0)".
 *
 * @param user - User event instance for interaction simulation
 * @param value - The kind value (checkbox value attribute) to click
 */
export async function clickKindFilterOption(user: UserEvent, value: string) {
  const checkboxes = screen.getAllByRole("checkbox");
  const checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === value,
  );
  if (!checkbox) {
    throw new Error(
      `Unable to find kind checkbox with value "${value}". Available: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }
  await user.click(checkbox);
}

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
 * Test helper function to fill the work year filter range.
 *
 * @param user - User event instance for interaction simulation
 * @param value1 - The starting year value
 * @param value2 - The ending year value
 */
export async function fillWorkYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Work Year", value1, value2);
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
