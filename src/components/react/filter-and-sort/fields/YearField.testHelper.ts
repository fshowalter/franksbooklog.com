import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

/**
 * Test helper function to fill a year range field.
 * Selects the specified years in both the "From" and "To" dropdowns
 * within a year field fieldset.
 *
 * @param user - User event instance for interaction simulation
 * @param labelText - Label text to locate the year field by
 * @param year1 - Year to select in the "From" dropdown
 * @param year2 - Year to select in the "To" dropdown
 */
export async function fillYearField(
  user: UserEvent,
  labelText: string,
  year1: string,
  year2: string,
) {
  const fieldset = screen.getByRole("group", { name: labelText });
  const fromInput = within(fieldset).getByLabelText("From");
  const toInput = within(fieldset).getByLabelText("to");

  await user.selectOptions(fromInput, year1);
  await user.selectOptions(toInput, year2);
}
