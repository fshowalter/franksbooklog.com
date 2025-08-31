import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextField } from "./TextField.testHelper";

export async function fillNameFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Name", value);
}

export function getNameFilter() {
  return screen.getByLabelText("Name");
}
