import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

import { fillTextField } from "~/components/Fields/TextField.testHelper";
import { fillYearField } from "~/components/Fields/YearField.testHelper";

export async function clickKindFilterOption(user: UserEvent, value: string) {
  await user.selectOptions(screen.getByLabelText("Kind"), value);
}

export async function fillGradeFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  const fieldset = screen.getByRole("group", { name: "Grade" });
  const fromInput = within(fieldset).getByLabelText("From");
  const toInput = within(fieldset).getByLabelText("to");

  await user.selectOptions(fromInput, value1);
  await user.selectOptions(toInput, value2);
}

export async function fillReviewYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Review Year", value1, value2);
}

export async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

export async function fillWorkYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Work Year", value1, value2);
}

export function getKindFilter() {
  return screen.getByLabelText("Kind");
}

export function getTitleFilter() {
  return screen.getByLabelText("Title");
}
