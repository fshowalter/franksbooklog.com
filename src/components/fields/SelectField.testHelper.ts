import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Test helper function to select an option from a select field.
 * Simulates user interaction with dropdown selection fields.
 *
 * @param user - User event instance for interaction simulation
 * @param labelText - Label text to locate the select field by
 * @param optionText - Text of the option to select
 */
export async function clickSelectFieldOption(
  user: UserEvent,
  labelText: string,
  optionText: string,
) {
  await user.selectOptions(screen.getByLabelText(labelText), optionText);
}
