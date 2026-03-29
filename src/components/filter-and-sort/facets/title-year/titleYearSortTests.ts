import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByTitleYear } from "./titleYearSort";

type TitleYearItem = SortableByTitleYear & {
  title: string;
};

/**
 * Sort-only sub-suite for title year. Use this for features that have title year
 * sort (Reviews, AuthorTitles).
 */
export function titleYearSortTests({
  getList,
  renderItems,
}: {
  getList: () => HTMLElement;
  renderItems: (items: TitleYearItem[]) => void;
}) {
  describe("titleYearSort", () => {
    it("sorts oldest first", async ({ expect }) => {
      renderItems([
        { title: "Modern Book", titleYear: "2000" },
        { title: "Classic Book", titleYear: "1980" },
        { title: "Mid Book", titleYear: "1990" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Title Year (Oldest First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Classic Book")).toBeLessThan(
        text.indexOf("Mid Book"),
      );
      expect(text.indexOf("Mid Book")).toBeLessThan(
        text.indexOf("Modern Book"),
      );
    });

    it("sorts newest first", async ({ expect }) => {
      renderItems([
        { title: "Classic Book", titleYear: "1980" },
        { title: "Modern Book", titleYear: "2000" },
        { title: "Mid Book", titleYear: "1990" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Title Year (Newest First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Modern Book")).toBeLessThan(
        text.indexOf("Mid Book"),
      );
      expect(text.indexOf("Mid Book")).toBeLessThan(
        text.indexOf("Classic Book"),
      );
    });
  });
}
