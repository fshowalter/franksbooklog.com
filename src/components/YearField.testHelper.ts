import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

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
