import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByGrade } from "./gradeSort";

type GradeItem = SortableByGrade & {
  title: string;
};

/**
 * Sort-only sub-suite for grade. Covers grade sort options.
 *
 * @example
 * gradeSortFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 */
export function gradeSortTests(
  renderItems: (items: GradeItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("gradeSort", () => {
    it("sorts best first", async ({ expect }) => {
      renderItems([
        { gradeValue: 9, title: "Okay Book" },
        { gradeValue: 16, title: "Great Book" },
        { gradeValue: 3, title: "Bad Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Grade (Best First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Great Book")).toBeLessThan(
        text.indexOf("Okay Book"),
      );
      expect(text.indexOf("Okay Book")).toBeLessThan(text.indexOf("Bad Book"));
    });

    it("sorts worst first", async ({ expect }) => {
      renderItems([
        { gradeValue: 16, title: "Great Book" },
        { gradeValue: 3, title: "Bad Book" },
        { gradeValue: 9, title: "Okay Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Grade (Worst First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Bad Book")).toBeLessThan(text.indexOf("Okay Book"));
      expect(text.indexOf("Okay Book")).toBeLessThan(
        text.indexOf("Great Book"),
      );
    });
  });
}
