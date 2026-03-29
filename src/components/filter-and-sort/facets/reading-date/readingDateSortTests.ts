import { within } from "@testing-library/react";
import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByReadingDate } from "./readingDateSort";

type ReadingDateItem = SortableByReadingDate & {
  readingDate: string;
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
 * readingDateSortTests({
 *   getList: getCalendar,
 *   renderItems: (items) => render(<ReadingLog {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function readingDateSortTests({
  getList,
  renderItems,
}: {
  /** Pass `getCalendar` from ReadingLog.testHelper or equivalent container getter */
  getList: () => HTMLElement;
  renderItems: (items: ReadingDateItem[]) => void;
}) {
  // Items in two different months so that sort direction changes which month
  // the calendar displays first. The calendar shows one month at a time;
  // filteredValues[0] after sorting determines the initial month.
  const items: ReadingDateItem[] = [
    {
      readingDate: "2024-01-15",
      sequence: 2,
      title: "Recent Reading",
    },
    {
      readingDate: "2023-12-10",
      sequence: 1,
      title: "Earlier Reading",
    },
  ];

  describe("reading year sort", () => {
    it("sorts newest first — calendar opens on most recent month", async ({
      expect,
    }) => {
      renderItems(items);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Reading Date (Newest First)");

      const list = getList();
      // January 2024 is the current month; December 2023 requires navigation
      expect(within(list).getByText("Recent Reading")).toBeInTheDocument();
      expect(
        within(list).queryByText("Earlier Reading"),
      ).not.toBeInTheDocument();
    });

    it("sorts oldest first — calendar opens on earliest month", async ({
      expect,
    }) => {
      renderItems(items);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Reading Date (Oldest First)");

      const list = getList();
      // December 2023 is the current month; January 2024 requires navigation
      expect(within(list).getByText("Earlier Reading")).toBeInTheDocument();
      expect(
        within(list).queryByText("Recent Reading"),
      ).not.toBeInTheDocument();
    });
  });
}
