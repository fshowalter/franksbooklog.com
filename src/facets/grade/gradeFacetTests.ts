import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import { getCoverList } from "~/components/cover-list/CoverList.testHelper";
import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { fillGradeFilter } from "~/components/filter-and-sort/ReviewedWorkFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type GradeItem = {
  grade: string;
  gradeValue: number;
  title: string;
};

/**
 * Shared test suite for the grade filter and sort facet.
 *
 * @example
 * gradeFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 */
export function gradeFacetTests(renderItems: (items: GradeItem[]) => void) {
  describe("grade filter", () => {
    it("filters to items within grade range", async ({ expect }) => {
      renderItems([
        { grade: "F", gradeValue: 3, title: "Bad Book" },
        { grade: "B", gradeValue: 12, title: "Good Book" },
        { grade: "A+", gradeValue: 16, title: "Great Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      const list = getCoverList();
      expect(within(list).getByText("Good Book")).toBeInTheDocument();
      expect(within(list).getByText("Great Book")).toBeInTheDocument();
      expect(within(list).queryByText("Bad Book")).not.toBeInTheDocument();
    });
  });

  describe("grade filter chip", () => {
    it("shows grade chip after applying filter", async ({ expect }) => {
      renderItems([
        { grade: "F", gradeValue: 3, title: "Bad Book" },
        { grade: "B", gradeValue: 12, title: "Good Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Grade: B- to A+ filter" }),
      ).toBeInTheDocument();
    });

    it("removing grade chip defers list update", async ({ expect }) => {
      renderItems([
        { grade: "F", gradeValue: 3, title: "Bad Book" },
        { grade: "B", gradeValue: 12, title: "Good Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      const list = getCoverList();
      expect(within(list).queryByText("Bad Book")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Grade: B- to A+ filter" }),
      );

      expect(
        screen.queryByRole("button", { name: "Remove Grade: B- to A+ filter" }),
      ).not.toBeInTheDocument();
      // List still filtered (activeFilterValues not yet cleared)
      expect(within(list).queryByText("Bad Book")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Bad Book")).toBeInTheDocument();
    });
  });

  describe("grade sort", () => {
    it("sorts best first", async ({ expect }) => {
      renderItems([
        { grade: "C", gradeValue: 6, title: "Okay Book" },
        { grade: "A+", gradeValue: 13, title: "Great Book" },
        { grade: "F", gradeValue: 1, title: "Bad Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Grade (Best First)");

      const list = getCoverList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Great Book")).toBeLessThan(
        text.indexOf("Okay Book"),
      );
      expect(text.indexOf("Okay Book")).toBeLessThan(text.indexOf("Bad Book"));
    });

    it("sorts worst first", async ({ expect }) => {
      renderItems([
        { grade: "A+", gradeValue: 13, title: "Great Book" },
        { grade: "F", gradeValue: 1, title: "Bad Book" },
        { grade: "C", gradeValue: 6, title: "Okay Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Grade (Worst First)");

      const list = getCoverList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Bad Book")).toBeLessThan(text.indexOf("Okay Book"));
      expect(text.indexOf("Okay Book")).toBeLessThan(
        text.indexOf("Great Book"),
      );
    });
  });
}
