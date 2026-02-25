import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

import { fillYearField } from "~/components/fields/YearField.testHelper";

export async function clickEditionFilterOption(user: UserEvent, value: string) {
  const editionFilter = getEditionFilter();
  // Click "Show more" if present, so all options are visible
  const showMoreButton = within(editionFilter).queryByRole("button", {
    name: /show more/i,
  });
  if (showMoreButton) {
    await user.click(showMoreButton);
  }
  const checkboxes = within(editionFilter).getAllByRole("checkbox");
  const checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === value,
  );
  if (!checkbox) {
    throw new Error(
      `Unable to find edition checkbox with value "${value}". Available: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }
  await user.click(checkbox);
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
  return screen.getByRole("group", { name: "Edition" });
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
