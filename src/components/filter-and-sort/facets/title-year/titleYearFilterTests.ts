import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./titleYearFilter";

type TitleYearItem = FilterableValue & {
  title: string;
};

/**
 * Filter-only sub-suite for title year. Use this for features that have a work
 * year filter but no title year sort (e.g. ReadingLog).
 *
 * `distinctTitleYears` must have at least 5 entries; items for the test are
 * derived from indices 0, 2, and last so the filter range [idx 1, idx last-1]
 * keeps only the middle item.
 */
export function titleYearFilterTests({
  distinctTitleYears,
  getList,
  renderItems,
}: {
  distinctTitleYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: TitleYearItem[]) => void;
}) {
  // Derive three non-adjacent years for items and a middle filter range so the
  // suite works with any distinctTitleYears list without hardcoding values that
  // may not be present (e.g. ReadingLog uses different years than Reviews).
  const low = distinctTitleYears[0];
  const mid = distinctTitleYears[2];
  const high = distinctTitleYears.at(-1)!;
  const filterFrom = distinctTitleYears[1];
  const filterTo = distinctTitleYears.at(-2)!;

  describe("titleYearFilter", () => {
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
