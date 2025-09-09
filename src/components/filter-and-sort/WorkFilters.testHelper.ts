import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextField } from "~/components/fields/TextField.testHelper";
import { fillYearField } from "~/components/fields/YearField.testHelper";

/**
 * Test helper function to select a kind filter option.
 *
 * @param user - User event instance for interaction simulation
 * @param value - The kind value to select
 */
export async function clickKindFilterOption(user: UserEvent, value: string) {
  await user.selectOptions(screen.getByLabelText("Kind"), value);
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
 * Test helper function to get the kind filter element.
 *
 * @returns The kind filter DOM element
 */
export function getKindFilter() {
  return screen.getByLabelText("Kind");
}

/**
 * Test helper function to get the title filter element.
 *
 * @returns The title filter DOM element
 */
export function getTitleFilter() {
  return screen.getByLabelText("Title");
}
