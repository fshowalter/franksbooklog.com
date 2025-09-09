import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

import { fillYearField } from "~/components/fields/YearField.testHelper";

export {
  clickKindFilterOption,
  fillTitleFilter,
  fillWorkYearFilter,
  getKindFilter,
  getTitleFilter,
} from "./WorkFilters.testHelper";

/**
 * Test helper function to fill the grade filter range.
 * 
 * @param user - User event instance for interaction simulation
 * @param value1 - The starting grade value
 * @param value2 - The ending grade value
 */
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

/**
 * Test helper function to fill the review year filter range.
 * 
 * @param user - User event instance for interaction simulation
 * @param value1 - The starting review year value
 * @param value2 - The ending review year value
 */
export async function fillReviewYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Review Year", value1, value2);
}
