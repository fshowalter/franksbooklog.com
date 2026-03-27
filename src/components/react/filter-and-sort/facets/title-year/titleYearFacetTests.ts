import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/react/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/react/filter-and-sort/fields/YearField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type TitleYearFacetAdapter = {
  distinctTitleYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: TitleYearItem[]) => void;
};

type TitleYearItem = {
  title: string;
  titleYear: string;
};

type TitleYearSortAdapter = {
  getList: () => HTMLElement;
  renderItems: (items: TitleYearItem[]) => void;
};

/**
 * Filter-only sub-suite for title year. Use this for features that have a work
 * year filter but no title year sort (e.g. ReadingLog).
 *
 * `distinctTitleYears` must have at least 5 entries; items for the test are
 * derived from indices 0, 2, and last so the filter range [idx 1, idx last-1]
 * keeps only the middle item.
 */
export function titleYearFilterFacetTests({
  distinctTitleYears,
  getList,
  renderItems,
}: TitleYearFacetAdapter) {
  // Derive three non-adjacent years for items and a middle filter range so the
  // suite works with any distinctTitleYears list without hardcoding values that
  // may not be present (e.g. ReadingLog uses different years than Reviews).
  const low = distinctTitleYears[0];
  const mid = distinctTitleYears[2];
  const high = distinctTitleYears.at(-1)!;
  const filterFrom = distinctTitleYears[1];
  const filterTo = distinctTitleYears.at(-2)!;

  describe("title year filter", () => {
    it("filters to items within title year range", async ({ expect }) => {
      renderItems([
        { title: "Old Book", titleYear: low },
        { title: "Mid Book", titleYear: mid },
        { title: "New Book", titleYear: high },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Title Year", filterFrom, filterTo);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Mid Book")).toBeInTheDocument();
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();
      expect(within(list).queryByText("New Book")).not.toBeInTheDocument();
    });
  });

  describe("title year filter chip", () => {
    // Filter to a single mid-range year so the chip appears (not the full range)
    // and items outside it are hidden, proving filter and chip work together.
    const earlyYear = distinctTitleYears[0];
    const midYear = distinctTitleYears[2];

    it("shows title year chip after applying filter", async ({ expect }) => {
      renderItems([
        { title: "Old Book", titleYear: earlyYear },
        { title: "Mid Book", titleYear: midYear },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Title Year", midYear, midYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: `Remove Title Year: ${midYear} filter`,
        }),
      ).toBeInTheDocument();
    });

    it("removing title year chip defers list update", async ({ expect }) => {
      renderItems([
        { title: "Old Book", titleYear: earlyYear },
        { title: "Mid Book", titleYear: midYear },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Title Year", midYear, midYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: `Remove Title Year: ${midYear} filter`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Remove Title Year: ${midYear} filter`,
        }),
      ).not.toBeInTheDocument();
      // List still filtered (activeFilterValues not yet cleared)
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Old Book")).toBeInTheDocument();
    });
  });
}

/**
 * Sort-only sub-suite for title year. Use this for features that have title year
 * sort (Reviews, AuthorTitles).
 */
export function titleYearSortFacetTests({
  getList,
  renderItems,
}: TitleYearSortAdapter) {
  describe("title year sort", () => {
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
