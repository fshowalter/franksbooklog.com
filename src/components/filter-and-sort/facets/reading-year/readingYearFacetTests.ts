import type { UserEvent } from "@testing-library/user-event";

import { within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";
import {
  clickPreviousMonthButton,
  getCalendar,
  queryPreviousMonthButton,
} from "~/features/reading-log/ReadingLog.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type ReadingYearFilterItem = {
  readingDate: string;
  readingYear: string;
  title: string;
};

type ReadingYearSortItem = {
  readingDate: string;
  readingYear: string;
  sequence: number;
  title: string;
};

export function readingYearFacetFilterTests({
  renderItems,
}: {
  renderItems: (items: ReadingYearFilterItem[]) => void;
}) {
  it("filters by reading year range", async ({ expect }) => {
    renderItems([
      {
        readingDate: "2012-03-01",
        readingYear: "2012",
        title: "Book 2012",
      },
      {
        readingDate: "2013-04-01",
        readingYear: "2013",
        title: "Book 2013",
      },
      {
        readingDate: "2014-05-01",
        readingYear: "2014",
        title: "Book 2014",
      },
    ]);

    const user = getUserWithFakeTimers();
    await clickToggleFilters(user);
    await fillReadingYearFilter(user, "2012", "2013");
    await clickViewResults(user);

    const calendar = getCalendar();
    expect(within(calendar).getByText("Book 2013")).toBeInTheDocument();

    await clickPreviousMonthButton(user);
    expect(within(calendar).getByText("Book 2012")).toBeInTheDocument();

    const prevButton = queryPreviousMonthButton();
    expect(prevButton).not.toBeInTheDocument();
  });
}

/**
 * Shared test suite for the reading date sort (reading-date-asc/desc).
 * Tests verify that the calendar shows entries in date order after changing sort.
 *
 * Note: reading year range filter tests live in ReadingLog.spec.tsx because
 * they require calendar month navigation helpers that are feature-specific.
 *
 * @example
 * readingYearSortFacetTests({
 *   getList: getCalendar,
 *   renderItems: (items) => render(<ReadingLog {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function readingYearFacetSortTests({
  getList,
  renderItems,
}: {
  /** Pass `getCalendar` from ReadingLog.testHelper or equivalent container getter */
  getList: () => HTMLElement;
  renderItems: (items: ReadingYearSortItem[]) => void;
}) {
  // Items in two different months so that sort direction changes which month
  // the calendar displays first. The calendar shows one month at a time;
  // filteredValues[0] after sorting determines the initial month.
  const items: ReadingYearSortItem[] = [
    {
      readingDate: "2024-01-15",
      readingYear: "2024",
      sequence: 2,
      title: "Recent Reading",
    },
    {
      readingDate: "2023-12-10",
      readingYear: "2023",
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

async function fillReadingYearFilter(
  user: UserEvent,
  year1: string,
  year2: string,
) {
  await fillYearField(user, "Reading Year", year1, year2);
}
