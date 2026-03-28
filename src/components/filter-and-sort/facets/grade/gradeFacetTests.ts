import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import type { GradeText, GradeValue } from "~/utils/grades";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type GradeItem = {
  grade: GradeText;
  gradeValue: GradeValue;
  title: string;
};

/**
 * Filter-only sub-suite for grade. Covers grade range filter and chip.
 *
 * @example
 * gradeFilterFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 */
export function gradeFilterFacetTests(
  renderItems: (items: GradeItem[]) => void,
  getList: () => HTMLElement,
) {
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

      const list = getList();
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

      const list = getList();
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
}

/**
 * Sort-only sub-suite for grade. Covers grade sort options.
 *
 * @example
 * gradeSortFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 */
export function gradeSortFacetTests(
  renderItems: (items: GradeItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("grade sort", () => {
    it("sorts best first", async ({ expect }) => {
      renderItems([
        { grade: "C", gradeValue: 9, title: "Okay Book" },
        { grade: "A+", gradeValue: 16, title: "Great Book" },
        { grade: "F", gradeValue: 3, title: "Bad Book" },
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
        { grade: "A+", gradeValue: 16, title: "Great Book" },
        { grade: "F", gradeValue: 3, title: "Bad Book" },
        { grade: "C", gradeValue: 9, title: "Okay Book" },
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

async function fillGradeFilter(
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
