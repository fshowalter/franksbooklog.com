import { screen } from "@testing-library/dom";

export function getAnimatedDetailsDisclosureElement(
  title: string,
): HTMLElement {
  return screen.getByRole("group", { name: title });
}
