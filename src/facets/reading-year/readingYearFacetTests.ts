import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type ReadingDateFacetAdapter = {
  /** Pass `getCalendar` from ReadingLog.testHelper or equivalent container getter */
  getList: () => HTMLElement;
  renderItems: (items: ReadingDateItem[]) => void;
};

type ReadingDateItem = {
  readingDate: string;
  readingYear: string;
  sequence: number;
  title: string;
};

/**
 * Shared test suite for the reading date sort (reading-date-asc/desc).
 * Tests verify that the calendar shows entries in date order after changing sort.
 *
 * Note: reading year range filter tests live in ReadingLog.spec.tsx because
 * they require calendar month navigation helpers that are feature-specific.
 *
 * @example
 * readingDateFacetTests({
 *   getList: getCalendar,
 *   renderItems: (items) => render(<ReadingLog {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function readingDateFacetTests({
  getList,
  renderItems,
}: ReadingDateFacetAdapter) {
  describe("reading date sort", () => {
    it("sorts newest first — entries appear in calendar day order", ({
      expect,
    }) => {
      renderItems([
        {
          readingDate: "2024-01-01",
          readingYear: "2024",
          sequence: 1,
          title: "Old Reading",
        },
        {
          readingDate: "2024-01-03",
          readingYear: "2024",
          sequence: 3,
          title: "New Reading",
        },
        {
          readingDate: "2024-01-02",
          readingYear: "2024",
          sequence: 2,
          title: "Mid Reading",
        },
      ]);

      const list = getList();
      const text = list.textContent ?? "";
      // Calendar shows books on their specific days (day 1 < day 2 < day 3)
      expect(text.indexOf("Old Reading")).toBeLessThan(
        text.indexOf("Mid Reading"),
      );
      expect(text.indexOf("Mid Reading")).toBeLessThan(
        text.indexOf("New Reading"),
      );
    });

    it("sorts oldest first after clicking sort option", async ({ expect }) => {
      renderItems([
        {
          readingDate: "2024-01-03",
          readingYear: "2024",
          sequence: 3,
          title: "New Reading",
        },
        {
          readingDate: "2024-01-01",
          readingYear: "2024",
          sequence: 1,
          title: "Old Reading",
        },
        {
          readingDate: "2024-01-02",
          readingYear: "2024",
          sequence: 2,
          title: "Mid Reading",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Reading Date (Oldest First)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Old Reading")).toBeLessThan(
        text.indexOf("Mid Reading"),
      );
      expect(text.indexOf("Mid Reading")).toBeLessThan(
        text.indexOf("New Reading"),
      );
    });
  });
}
