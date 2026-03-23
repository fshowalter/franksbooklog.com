import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import { getCoverList } from "~/components/cover-list/CoverList.testHelper";
import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { fillWorkYearFilter } from "~/components/filter-and-sort/WorkFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type WorkYearFacetAdapter = {
  distinctWorkYears: readonly string[];
  /** Defaults to `getCoverList`; pass `getCalendar` for ReadingLog */
  getList?: () => HTMLElement;
  renderItems: (items: WorkYearItem[]) => void;
};

type WorkYearItem = {
  title: string;
  workYear: string;
};

type WorkYearSortAdapter = {
  /** Defaults to `getCoverList` */
  getList?: () => HTMLElement;
  renderItems: (items: WorkYearItem[]) => void;
};

/**
 * Shared test suite for the work year filter and sort facet.
 *
 * @example
 * workYearFacetTests({
 *   distinctWorkYears: ["1980", "1985", "1990", "1995", "2000"],
 *   renderItems: (items) => render(<Reviews {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function workYearFacetTests(adapter: WorkYearFacetAdapter) {
  workYearFilterFacetTests(adapter);
  workYearSortFacetTests(adapter);
}

/**
 * Filter-only sub-suite for work year. Use this for features that have a work
 * year filter but no work year sort (e.g. ReadingLog).
 *
 * `distinctWorkYears` must have at least 5 entries; items for the test are
 * derived from indices 0, 2, and last so the filter range [idx 1, idx last-1]
 * keeps only the middle item.
 */
export function workYearFilterFacetTests({
  distinctWorkYears,
  getList = getCoverList,
  renderItems,
}: WorkYearFacetAdapter) {
  // Derive three non-adjacent years for items and a middle filter range so the
  // suite works with any distinctWorkYears list without hardcoding values that
  // may not be present (e.g. ReadingLog uses different years than Reviews).
  const low = distinctWorkYears[0];
  const mid = distinctWorkYears[2];
  const high = distinctWorkYears.at(-1)!;
  const filterFrom = distinctWorkYears[1];
  const filterTo = distinctWorkYears.at(-2)!;

  describe("work year filter", () => {
    it("filters to items within work year range", async ({ expect }) => {
      renderItems([
        { title: "Old Book", workYear: low },
        { title: "Mid Book", workYear: mid },
        { title: "New Book", workYear: high },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillWorkYearFilter(user, filterFrom, filterTo);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Mid Book")).toBeInTheDocument();
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();
      expect(within(list).queryByText("New Book")).not.toBeInTheDocument();
    });
  });

  describe("work year filter chip", () => {
    // Filter to a single mid-range year so the chip appears (not the full range)
    // and items outside it are hidden, proving filter and chip work together.
    const earlyYear = distinctWorkYears[0];
    const midYear = distinctWorkYears[2];

    it("shows work year chip after applying filter", async ({ expect }) => {
      renderItems([
        { title: "Old Book", workYear: earlyYear },
        { title: "Mid Book", workYear: midYear },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillWorkYearFilter(user, midYear, midYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: `Remove Work Year: ${midYear} filter`,
        }),
      ).toBeInTheDocument();
    });

    it("removing work year chip defers list update", async ({ expect }) => {
      renderItems([
        { title: "Old Book", workYear: earlyYear },
        { title: "Mid Book", workYear: midYear },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillWorkYearFilter(user, midYear, midYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: `Remove Work Year: ${midYear} filter`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Remove Work Year: ${midYear} filter`,
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
 * Sort-only sub-suite for work year. Use this for features that have work year
 * sort (Reviews, AuthorTitles). Already included in `workYearFacetTests`.
 */
function workYearSortFacetTests({
  getList = getCoverList,
  renderItems,
}: WorkYearSortAdapter) {
  describe("work year sort", () => {
    it("sorts oldest first", async ({ expect }) => {
      renderItems([
        { title: "Modern Book", workYear: "2000" },
        { title: "Classic Book", workYear: "1980" },
        { title: "Mid Book", workYear: "1990" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Work Year (Oldest First)");

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
        { title: "Classic Book", workYear: "1980" },
        { title: "Modern Book", workYear: "2000" },
        { title: "Mid Book", workYear: "1990" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Work Year (Newest First)");

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
