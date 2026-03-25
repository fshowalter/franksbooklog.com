import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/react/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/react/filter-and-sort/fields/YearField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type ReviewYearFacetAdapter = {
  /**
   * Distinct review years available in the filter, in ascending order.
   * Must contain at least 3 elements so that index [2] is a valid mid-range
   * year distinct from both the minimum ([0]) and the maximum (last element).
   */
  distinctReviewYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ReviewYearItem[]) => void;
};

type ReviewYearItem = {
  reviewSequence: string;
  reviewYear: string;
  title: string;
};

/**
 * Filter-only sub-suite for review year. Covers filter range and chip.
 *
 * @example
 * reviewYearFilterFacetTests({
 *   distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
 *   getList: getCoverList,
 *   renderItems: (items) => render(<Reviews {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function reviewYearFilterFacetTests({
  distinctReviewYears,
  getList,
  renderItems,
}: ReviewYearFacetAdapter) {
  if (distinctReviewYears.length < 3) {
    throw new Error(
      `reviewYearFilterFacetTests: distinctReviewYears must have at least 3 elements (got ${distinctReviewYears.length.toString()})`,
    );
  }
  describe("review year filter", () => {
    it("filters to items within review year range", async ({ expect }) => {
      renderItems([
        { reviewSequence: "1", reviewYear: "2022", title: "2022 Review" },
        { reviewSequence: "2", reviewYear: "2023", title: "2023 Review" },
        { reviewSequence: "3", reviewYear: "2024", title: "2024 Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Review Year", "2023", "2023");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("2023 Review")).toBeInTheDocument();
      expect(within(list).queryByText("2022 Review")).not.toBeInTheDocument();
      expect(within(list).queryByText("2024 Review")).not.toBeInTheDocument();
    });
  });

  describe("review year filter chip", () => {
    // Filter to a single mid-range year so the chip appears (not the full range)
    // and items outside it are hidden, proving filter and chip work together.
    const earlyYear = distinctReviewYears[0];
    const midYear = distinctReviewYears[2];

    it("shows review year chip after applying filter", async ({ expect }) => {
      renderItems([
        { reviewSequence: "1", reviewYear: earlyYear, title: "Early Review" },
        { reviewSequence: "2", reviewYear: midYear, title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Review Year", midYear, midYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: `Remove Review Year: ${midYear} filter`,
        }),
      ).toBeInTheDocument();
    });

    it("removing review year chip defers list update", async ({ expect }) => {
      renderItems([
        { reviewSequence: "1", reviewYear: earlyYear, title: "Early Review" },
        { reviewSequence: "2", reviewYear: midYear, title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Review Year", midYear, midYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("Early Review")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: `Remove Review Year: ${midYear} filter`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Remove Review Year: ${midYear} filter`,
        }),
      ).not.toBeInTheDocument();
      // List still filtered (activeFilter not yet cleared)
      expect(within(list).queryByText("Early Review")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Early Review")).toBeInTheDocument();
    });
  });
}

/**
 * Sort-only sub-suite for review year. Covers review date sort options.
 *
 * @example
 * reviewYearSortFacetTests(
 *   (items) => render(<Reviews {...baseProps} values={items.map(createValue)} />),
 *   getCoverList,
 * );
 */
export function reviewYearSortFacetTests(
  renderItems: (items: ReviewYearItem[]) => void,
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
