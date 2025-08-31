import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

export async function clickSelectField(
  user: UserEvent,
  labelText: string,
  optionText: string,
) {
  await user.selectOptions(screen.getByLabelText(labelText), optionText);
}
