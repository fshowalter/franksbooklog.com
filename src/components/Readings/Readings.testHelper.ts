import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectFieldOption } from "~/components/SelectField.testHelper";
import { fillYearField } from "~/components/YearField.testHelper";

export async function clickEditionFilterOption(user: UserEvent, value: string) {
  await clickSelectFieldOption(user, "Edition", value);
}

export async function clickNextMonthButton(user: UserEvent) {
  // Find and click the next month button first to ensure we can go back
  const nextMonthButton = await screen.findByRole("button", {
    name: /Navigate to next month:/,
  });
  await user.click(nextMonthButton);
}

export async function clickPreviousMonthButton(user: UserEvent) {
  // Find and click the next month button first to ensure we can go back
  const previousMonthButton = await screen.findByRole("button", {
    name: /Navigate to previous month:/,
  });
  await user.click(previousMonthButton);
}

export async function fillReadingYearFilter(
  user: UserEvent,
  year1: string,
  year2: string,
) {
  await fillYearField(user, "Reading Year", year1, year2);
}

export function getCalendar() {
  return screen.getByTestId("calendar");
}

export function getEditionFilter() {
  return screen.getByLabelText("Edition");
}

export function queryNextMonthButton() {
  return screen.queryByRole("button", {
    name: /Navigate to next month:/,
  });
}

export function queryPreviousMonthButton() {
  return screen.queryByRole("button", {
    name: /Navigate to previous month:/,
  });
}
