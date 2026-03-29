import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByReviewDate } from "./reviewDateSort";

type ReviewDateItem = SortableByReviewDate & {
  reviewYear: string;
  title: string;
};

export function reviewDateSortTests(
  renderItems: (items: ReviewDateItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("review date sort", () => {
    it("sorts newest first", async ({ expect }) => {
      renderItems([
        { reviewSequence: "3", reviewYear: "2024", title: "New Review" },
        { reviewSequence: "1", reviewYear: "2022", title: "Old Review" },
        { reviewSequence: "2", reviewYear: "2023", title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Review Date (Newest First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("New Review")).toBeLessThan(
        text.indexOf("Mid Review"),
      );
      expect(text.indexOf("Mid Review")).toBeLessThan(
        text.indexOf("Old Review"),
      );
    });

    it("sorts oldest first", async ({ expect }) => {
      renderItems([
        { reviewSequence: "3", reviewYear: "2024", title: "New Review" },
        { reviewSequence: "1", reviewYear: "2022", title: "Old Review" },
        { reviewSequence: "2", reviewYear: "2023", title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Review Date (Oldest First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Old Review")).toBeLessThan(
        text.indexOf("Mid Review"),
      );
      expect(text.indexOf("Mid Review")).toBeLessThan(
        text.indexOf("New Review"),
      );
    });
  });
}
