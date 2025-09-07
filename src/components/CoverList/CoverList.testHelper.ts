import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

export async function clickShowMore(user: UserEvent) {
  await user.click(screen.getByText("Show More"));
}

export function getGroupedCoverList() {
  return screen.getByTestId("grouped-cover-list");
}
