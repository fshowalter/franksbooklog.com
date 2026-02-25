import { render, screen, within } from "@testing-library/react";
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
  clickKindFilterOption,
  fillTitleFilter,
  fillWorkYearFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/WorkFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { ReadingLogProps, ReadingLogValue } from "./ReadingLog";

import { ReadingLog } from "./ReadingLog";
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

// Test helpers
let testIdCounter = 0;

function createReadingValue(
  overrides: Partial<ReadingLogValue> = {},
): ReadingLogValue {
  testIdCounter += 1;
  const readingDate = overrides.readingDate || "2024-01-01";
  return {
    abandoned: false,
    authors: [{ name: "Test Author" }],
    coverImageProps: {
      height: 375,
      src: "/cover.jpg",
      srcSet: "/cover.jpg 1x",
      width: 250,
    },
    edition: "Paperback",
    entrySequence: testIdCounter,
    kind: "Novel",
    progress: "Finished",
    readingDate,
    readingYear: "2024",
    reviewed: false,
    slug: `test-book-${testIdCounter}`,
    title: `Test Book ${testIdCounter}`,
    workYear: "1970",
    ...overrides,
  };
}

function resetTestIdCounter(): void {
  testIdCounter = 0;
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
    resetTestIdCounter();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by title", async ({ expect }) => {
      const readings = [
        createReadingValue({
          readingDate: "2024-01-15",
          title: "Dracula",
        }),
        createReadingValue({
          readingDate: "2024-01-16",
          title: "The Count of Monte Cristo",
        }),
        createReadingValue({
          readingDate: "2024-01-17",
          title: "The Stand",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Count");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("The Count of Monte Cristo"),
      ).toBeInTheDocument();
      expect(within(calendar).queryByText("Dracula")).not.toBeInTheDocument();
      expect(within(calendar).queryByText("The Stand")).not.toBeInTheDocument();
    });

    it("filters by edition", async ({ expect }) => {
      const readings = [
        createReadingValue({
          edition: "Paperback",
          title: "Book in Paperback",
        }),
        createReadingValue({
          edition: "Hardcover",
          title: "Book in Hardcover",
        }),
        createReadingValue({ edition: "Kindle", title: "Book on Kindle" }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickEditionFilterOption(user, "Paperback");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("Book in Paperback"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();
      expect(
        within(calendar).queryByText("Book on Kindle"),
      ).not.toBeInTheDocument();
    });

    it("filters by kind", async ({ expect }) => {
      const readings = [
        createReadingValue({
          kind: "Novel",
          readingDate: "2024-01-01",
          title: "A Novel",
        }),
        createReadingValue({
          kind: "Collection",
          readingDate: "2024-01-02",
          title: "A Collection",
        }),
        createReadingValue({
          kind: "Non-Fiction",
          readingDate: "2024-01-03",
          title: "Non-Fiction Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      // Initially all books should be visible
      let calendar = getCalendar();
      expect(within(calendar).getByText("A Novel")).toBeInTheDocument();
      expect(within(calendar).getByText("A Collection")).toBeInTheDocument();
      expect(
        within(calendar).getByText("Non-Fiction Book"),
      ).toBeInTheDocument();

      await clickToggleFilters(user);
      await clickKindFilterOption(user, "Novel");
      await clickViewResults(user);

      calendar = getCalendar();
      expect(within(calendar).getByText("A Novel")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("A Collection"),
      ).not.toBeInTheDocument();
      expect(
        within(calendar).queryByText("Non-Fiction Book"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status", async ({ expect }) => {
      const readings = [
        createReadingValue({
          reviewed: true,
          slug: "reviewed-book",
          title: "Reviewed Book",
        }),
        createReadingValue({
          reviewed: false,
          slug: undefined,
          title: "Unreviewed Book",
        }),
        createReadingValue({
          reviewed: true,
          slug: "another-reviewed",
          title: "Another Reviewed",
        }),
      ];

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
      const readings = [
        createReadingValue({
          reviewed: true,
          slug: "reviewed-book",
          title: "Reviewed Book",
        }),
        createReadingValue({
          reviewed: false,
          slug: undefined,
          title: "Unreviewed Book",
        }),
        createReadingValue({
          reviewed: false,
          slug: undefined,
          title: "Another Unreviewed",
        }),
      ];

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

    it("filters by multiple editions (OR logic)", async ({ expect }) => {
      const readings = [
        createReadingValue({
          edition: "Paperback",
          title: "Book in Paperback",
        }),
        createReadingValue({
          edition: "Hardcover",
          title: "Book in Hardcover",
        }),
        createReadingValue({ edition: "Kindle", title: "Book on Kindle" }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickEditionFilterOption(user, "Paperback");
      await clickEditionFilterOption(user, "Kindle");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("Book in Paperback"),
      ).toBeInTheDocument();
      expect(within(calendar).getByText("Book on Kindle")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();
    });

    it("filters by multiple kinds (OR logic)", async ({ expect }) => {
      const readings = [
        createReadingValue({
          kind: "Novel",
          readingDate: "2024-01-01",
          title: "A Novel",
        }),
        createReadingValue({
          kind: "Collection",
          readingDate: "2024-01-02",
          title: "A Collection",
        }),
        createReadingValue({
          kind: "Non-Fiction",
          readingDate: "2024-01-03",
          title: "Non-Fiction Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickKindFilterOption(user, "Novel");
      await clickKindFilterOption(user, "Collection");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("A Novel")).toBeInTheDocument();
      expect(within(calendar).getByText("A Collection")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Non-Fiction Book"),
      ).not.toBeInTheDocument();
    });

    it("filters by abandoned status", async ({ expect }) => {
      const readings = [
        createReadingValue({
          abandoned: true,
          progress: "Abandoned",
          title: "Abandoned Book",
        }),
        createReadingValue({ title: "Normal Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Abandoned");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Abandoned Book")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Normal Book"),
      ).not.toBeInTheDocument();
    });

    it("filters by work year range", async ({ expect }) => {
      const readings = [
        createReadingValue({ title: "Old Book", workYear: "1950" }),
        createReadingValue({ title: "Mid Book", workYear: "1970" }),
        createReadingValue({ title: "New Book", workYear: "2020" }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await fillWorkYearFilter(user, "1960", "1980");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Mid Book")).toBeInTheDocument();
      expect(within(calendar).queryByText("Old Book")).not.toBeInTheDocument();
      expect(within(calendar).queryByText("New Book")).not.toBeInTheDocument();
    });

    it("filters by reading year range", async ({ expect }) => {
      const readings = [
        createReadingValue({
          readingDate: "2012-06-15",
          readingYear: "2012",
          title: "Book 2012",
        }),
        createReadingValue({
          readingDate: "2013-06-15",
          readingYear: "2013",
          title: "Book 2013",
        }),
        createReadingValue({
          readingDate: "2014-06-15",
          readingYear: "2014",
          title: "Book 2014",
        }),
      ];

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
    it("sorts by reading date newest first", ({ expect }) => {
      const readings = [
        createReadingValue({
          entrySequence: 1,
          readingDate: "2024-01-01",
          title: "Old Reading",
        }),
        createReadingValue({
          entrySequence: 3,
          readingDate: "2024-01-03",
          title: "New Reading",
        }),
        createReadingValue({
          entrySequence: 2,
          readingDate: "2024-01-02",
          title: "Mid Reading",
        }),
      ];

      render(<ReadingLog {...baseProps} values={readings} />);

      const calendar = getCalendar();

      const books = ["New Reading", "Mid Reading", "Old Reading"];
      const foundBooks = books.filter((book) =>
        calendar.textContent?.includes(book),
      );

      expect(foundBooks).toHaveLength(3);

      // Verify they're in the right order by checking their position in the calendar
      const allText = calendar.textContent || "";
      const newIndex = allText.indexOf("3New Reading"); // Day 3
      const midIndex = allText.indexOf("2Mid Reading"); // Day 2
      const oldIndex = allText.indexOf("1Old Reading"); // Day 1

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });

    it("sorts by reading date oldest first", async ({ expect }) => {
      const readings = [
        createReadingValue({
          readingDate: "2024-01-03",
          title: "New Reading",
        }),
        createReadingValue({
          readingDate: "2024-01-01",
          title: "Old Reading",
        }),
        createReadingValue({
          readingDate: "2024-01-02",
          title: "Mid Reading",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickSortOption(user, "Reading Date (Oldest First)");

      const calendar = getCalendar();
      const allText = calendar.textContent || "";
      const oldIndex = allText.indexOf("Old Reading");
      const midIndex = allText.indexOf("Mid Reading");
      const newIndex = allText.indexOf("New Reading");

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });

  describe("month navigation", () => {
    it("navigates to previous month", async ({ expect }) => {
      const readings = [
        createReadingValue({
          entrySequence: 2,
          readingDate: "2024-02-15",
          title: "February Book",
        }),
        createReadingValue({
          entrySequence: 1,
          readingDate: "2024-01-15",
          title: "January Book",
        }),
      ];

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
      const readings = [
        createReadingValue({
          readingDate: "2024-01-15",
          title: "January Book",
        }),
        createReadingValue({
          readingDate: "2024-02-15",
          title: "February Book",
        }),
      ];

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

    it("shows correct navigation buttons", async ({ expect }) => {
      const readings = [
        createReadingValue({
          readingDate: "2024-01-15",
          title: "January Book",
        }),
        createReadingValue({
          readingDate: "2023-12-15",
          readingYear: "2023",
          title: "December Book",
        }),
        createReadingValue({
          readingDate: "2024-02-15",
          title: "February Book",
        }),
      ];

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

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const readings = [
        createReadingValue({ edition: "Paperback", title: "The Shining" }),
        createReadingValue({ edition: "Hardcover", title: "Pet Sematary" }),
      ];

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
      const readings = [
        createReadingValue({ title: "Dracula" }),
        createReadingValue({ title: "The Stand" }),
      ];

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

  describe("applied filters", () => {
    it("shows edition chip in drawer after applying edition filter", async ({
      expect,
    }) => {
      const readings = [
        createReadingValue({
          edition: "Paperback",
          title: "Book in Paperback",
        }),
        createReadingValue({
          edition: "Hardcover",
          title: "Book in Hardcover",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickEditionFilterOption(user, "Paperback");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Paperback filter" }),
      ).toBeInTheDocument();
    });

    it("removing edition chip immediately restores filtered-out items", async ({
      expect,
    }) => {
      const readings = [
        createReadingValue({
          edition: "Paperback",
          title: "Book in Paperback",
        }),
        createReadingValue({
          edition: "Hardcover",
          title: "Book in Hardcover",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<ReadingLog {...baseProps} values={readings} />);

      await clickToggleFilters(user);
      await clickEditionFilterOption(user, "Paperback");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Paperback filter" }),
      );

      expect(
        within(calendar).getByText("Book in Hardcover"),
      ).toBeInTheDocument();
    });
  });

  describe("reading progress display", () => {
    it("displays abandoned readings with special badge", ({ expect }) => {
      const readings = [
        createReadingValue({
          progress: "Abandoned",
          readingDate: "2024-01-01",
          title: "Abandoned Book",
        }),
        createReadingValue({
          progress: "Finished",
          readingDate: "2024-01-02",
          title: "Finished Book",
        }),
        createReadingValue({
          progress: "50%",
          readingDate: "2024-01-03",
          title: "In Progress Book",
        }),
      ];

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
      const readings = [
        createReadingValue({
          progress: "25%",
          readingDate: "2024-01-01",
          title: "Quarter Done",
        }),
        createReadingValue({
          progress: "75%",
          readingDate: "2024-01-02",
          title: "Three Quarters",
        }),
        createReadingValue({
          progress: "Abandoned",
          readingDate: "2024-01-03",
          title: "Gave Up",
        }),
        createReadingValue({
          progress: "Finished",
          readingDate: "2024-01-04",
          title: "Completed",
        }),
      ];

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
      const readings = [
        createReadingValue({
          authors: [{ name: "Terry Pratchett" }, { name: "Neil Gaiman" }],
          readingDate: "2024-01-01",
          title: "Good Omens",
        }),
        createReadingValue({
          authors: [{ name: "Stephen King" }, { name: "Peter Straub" }],
          readingDate: "2024-01-02",
          title: "The Talisman",
        }),
      ];

      render(<ReadingLog {...baseProps} values={readings} />);

      const calendar = getCalendar();

      // Check that all authors are displayed with proper formatting
      expect(within(calendar).getByText(/Terry Pratchett/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Neil Gaiman/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Stephen King/)).toBeInTheDocument();
      expect(within(calendar).getByText(/Peter Straub/)).toBeInTheDocument();
    });

    it("filters books with multiple authors correctly", async ({ expect }) => {
      const readings = [
        createReadingValue({
          authors: [{ name: "Terry Pratchett" }, { name: "Neil Gaiman" }],
          kind: "Novel",
          readingDate: "2024-01-01",
          title: "Good Omens",
        }),
        createReadingValue({
          authors: [{ name: "Terry Pratchett" }],
          kind: "Novel",
          readingDate: "2024-01-02",
          title: "The Colour of Magic",
        }),
        createReadingValue({
          authors: [{ name: "Neil Gaiman" }],
          kind: "Novel",
          readingDate: "2024-01-03",
          title: "Stardust",
        }),
      ];

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
      const readings = [
        createReadingValue({
          authors: [{ name: "Author One" }, { name: "Author Two" }],
          progress: "30%",
          readingDate: "2024-01-15",
          title: "In Progress Multi-Author",
        }),
        createReadingValue({
          authors: [{ name: "Author Three" }, { name: "Author Four" }],
          progress: "Abandoned",
          readingDate: "2024-01-16",
          title: "Abandoned Multi-Author",
        }),
      ];

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
