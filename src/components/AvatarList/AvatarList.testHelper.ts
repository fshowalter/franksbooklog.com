import { screen } from "@testing-library/react";

export function getGroupedAvatarList() {
  return screen.getByTestId("grouped-avatar-list");
}
