import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByTitle } from "./titleSort";

type TitleSortItem = SortableByTitle & {
  title: string;
};

/**
 * Sort-only sub-suite for title. Use this for features that have title sort
 * (Reviews, AuthorTitles).
 */
export function titleSortTests(
  renderItems: (items: TitleSortItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("titleSort", () => {
    it("sorts A → Z", async ({ expect }) => {
      renderItems([
        { sortTitle: "zebra", title: "Zebra Book" },
        { sortTitle: "alpha", title: "Alpha Book" },
        { sortTitle: "middle", title: "Middle Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Title (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Alpha Book")).toBeLessThan(
        text.indexOf("Middle Book"),
      );
      expect(text.indexOf("Middle Book")).toBeLessThan(
        text.indexOf("Zebra Book"),
      );
    });

    it("sorts Z → A", async ({ expect }) => {
      renderItems([
        { sortTitle: "alpha", title: "Alpha Book" },
        { sortTitle: "zebra", title: "Zebra Book" },
        { sortTitle: "middle", title: "Middle Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Title (Z → A)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Zebra Book")).toBeLessThan(
        text.indexOf("Middle Book"),
      );
      expect(text.indexOf("Middle Book")).toBeLessThan(
        text.indexOf("Alpha Book"),
      );
    });
  });
}
