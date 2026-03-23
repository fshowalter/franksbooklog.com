import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/filter-and-sort/ReviewedStatusFilter.testHelper";
import {
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/WorkFilters.testHelper";
import { editionFacetTests } from "~/facets/edition/editionFacetTests";
import { kindFacetTests } from "~/facets/kind/kindFacetTests";
import { readingYearSortFacetTests } from "~/facets/reading-year/readingYearFacetTests";
import { reviewedStatusFacetTests } from "~/facets/reviewed-status/reviewedStatusFacetTests";
import { titleFilterFacetTests } from "~/facets/title/titleFacetTests";
import { workYearFilterFacetTests } from "~/facets/work-year/workYearFacetTests";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { ReadingLogProps, ReadingLogValue } from "./ReadingLog";

import { ReadingLog } from "./ReadingLog";
import { selectedMonthDateReducer } from "./ReadingLog.reducer";
import {
  clickEditionFilterOption,
  clickNextMonthButton,
  clickPreviousMonthButton,
  fillReadingYearFilter,
  getCalendar,
  getEditionFilter,
  queryNextMonthButton,
  queryPreviousMonthButton,
} from "./ReadingLog.testHelper";

function createReadingValues(
  overrides: Partial<ReadingLogValue>[] = [],
): ReadingLogValue[] {
  return overrides.map((override, index) => {
    const readingDate = override.readingDate || "2024-01-01";
    return {
      abandoned: false,
      authors: [{ name: `Test Author ${index}`, notes: undefined }],
      coverImageProps: {
        height: 375,
        src: "/cover.jpg",
        srcSet: "/cover.jpg 1x",
        width: 250,
      },
      edition: "Paperback",
      kind: "Novel",
      progress: "Finished",
      readingDate,
      readingYear: "2024",
      reviewed: true,
      sequence: index,
      slug: `test-book-${index}`,
      title: `Test Book ${index}`,
      workYear: "1970",
      ...override,
    };
  });
}

const baseProps: ReadingLogProps = {
  distinctEditions: ["All", "Paperback", "Hardcover", "Kindle", "Audiobook"],
  distinctKinds: ["All", "Novel", "Collection", "Non-Fiction", "Short Story"],
  distinctReadingYears: [
    "2012",
    "2013",
    "2014",
    "2015",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
  ],
  distinctWorkYears: [
    "1950",
    "1960",
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    "2020",
  ],
  initialSort: "reading-date-desc",
  values: [],
};

describe("ReadingLog", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // Shared facet test suites
  kindFacetTests(
    (items) =>
      render(
        <ReadingLog
          {...baseProps}
          values={createReadingValues(
            items.map(({ kind, title }) => ({
              kind,
              readingDate: "2024-01-01",
              title,
            })),
          )}
        />,
      ),
    getCalendar,
  );

  reviewedStatusFacetTests(
    (items) =>
      render(
        <ReadingLog
          {...baseProps}
          values={createReadingValues(
            items.map(({ abandoned, title }) => ({
              abandoned,
              progress: abandoned ? "Abandoned" : "Finished",
              readingDate: "2024-01-01",
              title,
            })),
          )}
        />,
      ),
    getCalendar,
  );

  editionFacetTests({
    getList: getCalendar,
    renderItems: (items) =>
      render(
        <ReadingLog
          {...baseProps}
          values={createReadingValues(
            items.map(({ edition, title }) => ({
              edition,
              readingDate: "2024-01-01",
              title,
            })),
          )}
        />,
      ),
  });

  readingYearSortFacetTests({
    getList: getCalendar,
    renderItems: (items) =>
      render(
        <ReadingLog
          {...baseProps}
          initialSort="reading-date-desc"
          values={createReadingValues(items)}
        />,
      ),
  });

  titleFilterFacetTests(
    (items) =>
      render(
        <ReadingLog
          {...baseProps}
          values={createReadingValues(
            items.map(({ sortTitle, title }) => ({ sortTitle, title })),
          )}
        />,
      ),
    getCalendar,
  );

  workYearFilterFacetTests({
    distinctWorkYears: baseProps.distinctWorkYears,
    getList: getCalendar,
    renderItems: (items) =>
      render(
        <ReadingLog
          {...baseProps}
          values={createReadingValues(
            items.map(({ title, workYear }) => ({ title, workYear })),
          )}
        />,
      ),
  });

  describe("filtering", () => {
    it("filters by reviewed status", async ({ expect }) => {
      const readings = createReadingValues([
        {
          reviewed: true,
          slug: "reviewed-book",
          title: "Reviewed Book",
        },
        {
          reviewed: false,
          slug: undefined,
          title: "Unreviewed Book",
        },
        {
          reviewed: true,
          slug: "another-reviewed",
          title: "Another Reviewed",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Reviewed Book")).toBeInTheDocument();
      expect(
        within(calendar).getByText("Another Reviewed"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Unreviewed Book"),
      ).not.toBeInTheDocument();
    });

    it("filters by unreviewed status", async ({ expect }) => {
      const readings = createReadingValues([
        {
          reviewed: true,
          slug: "reviewed-book",
          title: "Reviewed Book",
        },
        {
          reviewed: false,
          slug: undefined,
          title: "Unreviewed Book",
        },
        {
          reviewed: false,
          slug: undefined,
          title: "Another Unreviewed",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Unreviewed Book")).toBeInTheDocument();
      expect(
        within(calendar).getByText("Another Unreviewed"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Reviewed Book"),
      ).not.toBeInTheDocument();
    });

    it("filters by reading year range", async ({ expect }) => {
      const readings = createReadingValues([
        {
          readingDate: "2012-06-15",
          readingYear: "2012",
          title: "Book 2012",
        },
        {
          readingDate: "2013-06-15",
          readingYear: "2013",
          title: "Book 2013",
        },
        {
          readingDate: "2014-06-15",
          readingYear: "2014",
          title: "Book 2014",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(
        <ReadingLog
          {...baseProps}
          initialSort="reading-date-asc"
          values={readings}
        />,
      );

      await clickToggleFilters(user);
      await fillReadingYearFilter(user, "2012", "2013");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Book 2012")).toBeInTheDocument();

      await clickNextMonthButton(user);
      expect(within(calendar).getByText("Book 2013")).toBeInTheDocument();

      const nextButton = queryNextMonthButton();
      expect(nextButton).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("shows correct navigation buttons when changing sort", async ({
      expect,
    }) => {
      const readings = createReadingValues([
        {
          readingDate: "2024-01-15",
          title: "January Book",
        },
        {
          readingDate: "2023-12-15",
          readingYear: "2023",
          title: "December Book",
        },
        {
          readingDate: "2024-02-15",
          title: "February Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      // Default sort is newest first, showing February 2024
      let prevMonthButton = queryPreviousMonthButton();
      let nextMonthButton = queryNextMonthButton();

      // At newest month, should only have previous month button
      expect(prevMonthButton).toBeInTheDocument();
      expect(nextMonthButton).not.toBeInTheDocument();

      // Sort by oldest first
      await clickSortOption(user, "Reading Date (Oldest First)");

      // At oldest month, should only have next month button
      prevMonthButton = queryPreviousMonthButton();
      nextMonthButton = queryNextMonthButton();

      expect(prevMonthButton).not.toBeInTheDocument();
      expect(nextMonthButton).toBeInTheDocument();
    });
  });

  describe("month navigation", () => {
    it("navigates to previous month", async ({ expect }) => {
      const readings = createReadingValues([
        {
          readingDate: "2024-02-15",
          sequence: 2,
          title: "February Book",
        },
        {
          readingDate: "2024-01-15",
          sequence: 1,
          title: "January Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      // Default sort is newest first (by entrySequence), initially shows February 2024
      let calendar = getCalendar();

      // Verify we're on February
      const februaryText = calendar.textContent || "";
      if (!februaryText.includes("February Book")) {
        // We might be on January, click next to get to February
        const nextBtn = queryNextMonthButton();
        if (nextBtn) {
          await user.click(nextBtn);
          calendar = getCalendar();
        }
      }

      expect(within(calendar).getByText("February Book")).toBeInTheDocument();

      await clickPreviousMonthButton(user);

      // Should now show January 2024
      calendar = getCalendar();
      expect(within(calendar).getByText("January Book")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("February Book"),
      ).not.toBeInTheDocument();
    });

    it("navigates to next month", async ({ expect }) => {
      const readings = createReadingValues([
        {
          readingDate: "2024-01-15",
          title: "January Book",
        },
        {
          readingDate: "2024-02-15",
          title: "February Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(
        <ReadingLog
          {...baseProps}
          initialSort="reading-date-asc"
          values={readings}
        />,
      );

      // Initially should show January 2024 (oldest first)
      const calendar = getCalendar();
      expect(within(calendar).getByText("January Book")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("February Book"),
      ).not.toBeInTheDocument();

      await clickNextMonthButton(user);

      // Should now show February 2024
      expect(within(calendar).getByText("February Book")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("January Book"),
      ).not.toBeInTheDocument();
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const readings = createReadingValues([
        { edition: "Paperback", title: "The Shining" },
        { edition: "Hardcover", title: "Pet Sematary" },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "The Shining");
      await clickEditionFilterOption(user, "Paperback");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("The Shining")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Pet Sematary"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");
      expect(
        within(getEditionFilter()).queryAllByRole("checkbox", {
          checked: true,
        }),
      ).toHaveLength(0);

      await clickViewResults(user);

      expect(within(calendar).getByText("The Shining")).toBeInTheDocument();
      expect(within(calendar).getByText("Pet Sematary")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const readings = createReadingValues([
        { title: "Dracula" },
        { title: "The Stand" },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Dracula")).toBeInTheDocument();
      expect(within(calendar).queryByText("The Stand")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different Book");
      await clickCloseFilters(user);

      // Should still show originally filtered results
      expect(within(calendar).getByText("Dracula")).toBeInTheDocument();
      expect(within(calendar).queryByText("The Stand")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dracula");
    });
  });

  describe("reading progress display", () => {
    it("displays abandoned readings with special badge", ({ expect }) => {
      const readings = createReadingValues([
        {
          progress: "Abandoned",
          readingDate: "2024-01-01",
          title: "Abandoned Book",
        },
        {
          progress: "Finished",
          readingDate: "2024-01-02",
          title: "Finished Book",
        },
        {
          progress: "50%",
          readingDate: "2024-01-03",
          title: "In Progress Book",
        },
      ]);

      render(<ReadingLog {...baseProps} values={readings} />);

      const calendar = getCalendar();

      // Check that abandoned book is displayed
      expect(within(calendar).getByText("Abandoned Book")).toBeInTheDocument();

      // Check that the abandoned badge is shown
      expect(within(calendar).getByText("Abandoned")).toBeInTheDocument();

      // Check that finished book shows its progress
      expect(within(calendar).getByText("Finished Book")).toBeInTheDocument();
      expect(within(calendar).getByText("Finished")).toBeInTheDocument();

      // Check that in-progress book shows percentage
      expect(
        within(calendar).getByText("In Progress Book"),
      ).toBeInTheDocument();
      expect(within(calendar).getByText("50%")).toBeInTheDocument();
    });

    it("displays various progress states correctly", ({ expect }) => {
      const readings = createReadingValues([
        {
          progress: "25%",
          readingDate: "2024-01-01",
          title: "Quarter Done",
        },
        {
          progress: "75%",
          readingDate: "2024-01-02",
          title: "Three Quarters",
        },
        {
          progress: "Abandoned",
          readingDate: "2024-01-03",
          title: "Gave Up",
        },
        {
          progress: "Finished",
          readingDate: "2024-01-04",
          title: "Completed",
        },
      ]);

      render(<ReadingLog {...baseProps} values={readings} />);

      const calendar = getCalendar();

      // Verify all books and their progress indicators are shown
      expect(within(calendar).getByText("Quarter Done")).toBeInTheDocument();
      expect(within(calendar).getByText("25%")).toBeInTheDocument();

      expect(within(calendar).getByText("Three Quarters")).toBeInTheDocument();
      expect(within(calendar).getByText("75%")).toBeInTheDocument();

      expect(within(calendar).getByText("Gave Up")).toBeInTheDocument();
      expect(within(calendar).getByText("Abandoned")).toBeInTheDocument();

      expect(within(calendar).getByText("Completed")).toBeInTheDocument();
      expect(within(calendar).getByText("Finished")).toBeInTheDocument();
    });
  });

  describe("multiple authors", () => {
    it("displays all authors for books with multiple authors", ({ expect }) => {
      const readings = createReadingValues([
        {
          authors: [
            { name: "Terry Pratchett", notes: undefined },
            { name: "Neil Gaiman", notes: undefined },
          ],
          readingDate: "2024-01-01",
          title: "Good Omens",
        },
        {
          authors: [
            { name: "Stephen King", notes: undefined },
            { name: "Peter Straub", notes: undefined },
          ],
          readingDate: "2024-01-02",
          title: "The Talisman",
        },
      ]);

      render(<ReadingLog {...baseProps} values={readings} />);

      const calendar = getCalendar();

      // Check that all authors are displayed with proper formatting
      expect(within(calendar).getByText(/Terry Pratchett/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Neil Gaiman/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Stephen King/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Peter Straub/)).toBeInTheDocument();
    });

    it("filters books with multiple authors correctly", async ({ expect }) => {
      const readings = createReadingValues([
        {
          authors: [
            { name: "Terry Pratchett", notes: undefined },
            { name: "Neil Gaiman", notes: undefined },
          ],
          kind: "Novel",
          readingDate: "2024-01-01",
          title: "Good Omens",
        },
        {
          authors: [{ name: "Terry Pratchett", notes: undefined }],
          kind: "Novel",
          readingDate: "2024-01-02",
          title: "The Colour of Magic",
        },
        {
          authors: [{ name: "Neil Gaiman", notes: undefined }],
          kind: "Novel",
          readingDate: "2024-01-03",
          title: "Stardust",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Good Omens");
      await clickViewResults(user);

      const calendar = getCalendar();

      // Should show the co-authored book
      expect(within(calendar).getByText("Good Omens")).toBeInTheDocument();
      expect(within(calendar).getByText(/Terry Pratchett/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Neil Gaiman/)).toBeInTheDocument();

      // Should not show the solo-authored books
      expect(
        within(calendar).queryByText("The Colour of Magic"),
      ).not.toBeInTheDocument();
      expect(within(calendar).queryByText("Stardust")).not.toBeInTheDocument();
    });

    it("displays reading progress correctly for multi-author books", ({
      expect,
    }) => {
      const readings = createReadingValues([
        {
          authors: [
            { name: "Author One", notes: undefined },
            { name: "Author Two", notes: undefined },
          ],
          progress: "30%",
          readingDate: "2024-01-15",
          title: "In Progress Multi-Author",
        },
        {
          authors: [
            { name: "Author Three", notes: undefined },
            { name: "Author Four", notes: undefined },
          ],
          progress: "Abandoned",
          readingDate: "2024-01-16",
          title: "Abandoned Multi-Author",
        },
      ]);

      render(<ReadingLog {...baseProps} values={readings} />);

      const calendar = getCalendar();

      // Check that progress is shown correctly for multi-author books
      expect(within(calendar).getByText("30%")).toBeInTheDocument();
      expect(within(calendar).getByText("Abandoned")).toBeInTheDocument();

      // Check authors are still displayed
      expect(within(calendar).getByText(/Author One/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Author Two/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Author Three/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Author Four/)).toBeInTheDocument();
    });
  });
});

describe("selectedMonthDateReducer", () => {
  const withDate = { selectedMonthDate: "2024-01" };
  const withoutDate = { selectedMonthDate: undefined };

  it("clears selectedMonthDate on filters/applied", ({ expect }) => {
    const result = selectedMonthDateReducer(withDate, {
      type: "filters/applied",
    });
    expect(result.selectedMonthDate).toBeUndefined();
  });

  it("clears selectedMonthDate on sort/sort", ({ expect }) => {
    const result = selectedMonthDateReducer(withDate, { type: "sort/sort" });
    expect(result.selectedMonthDate).toBeUndefined();
  });

  it("sets selectedMonthDate on readingLog/nextMonthClicked", ({ expect }) => {
    const action = { type: "readingLog/nextMonthClicked", value: "2024-02" };
    const result = selectedMonthDateReducer(withoutDate, action);
    expect(result.selectedMonthDate).toBe("2024-02");
  });

  it("sets selectedMonthDate on readingLog/previousMonthClicked", ({
    expect,
  }) => {
    const action = { type: "readingLog/previousMonthClicked", value: "2023-12" };
    const result = selectedMonthDateReducer(withDate, action);
    expect(result.selectedMonthDate).toBe("2023-12");
  });

  it("returns state unchanged for unrecognised actions", ({ expect }) => {
    const result = selectedMonthDateReducer(withDate, {
      type: "some/other",
    });
    expect(result).toBe(withDate);
  });
});
