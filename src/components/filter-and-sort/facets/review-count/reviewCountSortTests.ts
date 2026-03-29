import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByReviewCount } from "./reviewCountSort";

type ReviewCountItem = SortableByReviewCount & {
  name: string;
};

export function reviewCountSortTests(
  renderItems: (items: ReviewCountItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("reviewCountSort", () => {
    it("sorts by review count fewest first", async ({ expect }) => {
      renderItems([
        { name: "Popular Author", reviewCount: 20 },
        { name: "New Author", reviewCount: 1 },
        { name: "Mid Author", reviewCount: 10 },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Review Count (Fewest First)");

      const list = getList();
      const allText = list.textContent || "";
      const newIndex = allText.indexOf("New Author");
      const midIndex = allText.indexOf("Mid Author");
      const popularIndex = allText.indexOf("Popular Author");

      expect(newIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(popularIndex);
    });

    it("sorts by review count most first", async ({ expect }) => {
      renderItems([
        { name: "Popular Author", reviewCount: 20 },
        { name: "New Author", reviewCount: 1 },
        { name: "Mid Author", reviewCount: 10 },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Review Count (Most First)");

      const list = getList();
      const allText = list.textContent || "";
      const newIndex = allText.indexOf("New Author");
      const midIndex = allText.indexOf("Mid Author");
      const popularIndex = allText.indexOf("Popular Author");

      expect(popularIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });
}
