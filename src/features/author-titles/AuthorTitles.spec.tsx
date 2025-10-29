import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickShowMore,
  getGroupedCoverList,
} from "~/components/cover-list/CoverList.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import {
  clickKindFilterOption,
  fillGradeFilter,
  fillReviewYearFilter,
  fillTitleFilter,
  fillWorkYearFilter,
  getKindFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedWorkFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { AuthorTitlesProps, AuthorTitlesValue } from "./AuthorTitles";

import { AuthorTitles } from "./AuthorTitles";

// Test helpers
let testIdCounter = 0;

function createAuthorTitleValue(
  overrides: Partial<AuthorTitlesValue> = {},
): AuthorTitlesValue {
  testIdCounter += 1;
  const title = overrides.title || `Test Title ${testIdCounter}`;
  return {
    coverImageProps: {
      height: 400,
      src: "/cover.jpg",
      srcSet: "/cover.jpg 1x",
      width: 250,
    },
    displayDate: "Jan 1, 2024",
    grade: "B+",
    gradeValue: 10,
    kind: "Novel",
    otherAuthors: [],
    reviewDate: new Date("2024-01-01"),
    reviewSequence: testIdCounter.toLocaleString("en-US", {
      minimumIntegerDigits: 3,
    }),
    reviewYear: "2024",
    slug: `test-title-${testIdCounter}`,
    sortTitle: title.toLowerCase(),
    title,
    workYear: "1990",
    ...overrides,
  };
}

function resetTestIdCounter(): void {
  testIdCounter = 0;
}

const baseProps: AuthorTitlesProps = {
  distinctKinds: ["All", "Novel", "Collection", "Non-Fiction", "Short Story"],
  distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
  distinctWorkYears: ["1980", "1985", "1990", "1995", "2000", "2005", "2010"],
  initialSort: "title-asc",
  values: [],
};

describe("AuthorTitles", () => {
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
      const titles = [
        createAuthorTitleValue({ title: "The Cellar" }),
        createAuthorTitleValue({ title: "Night Show" }),
        createAuthorTitleValue({ title: "The Woods Are Dark" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Cellar");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("The Cellar")).toBeInTheDocument();
      expect(within(list).queryByText("Night Show")).not.toBeInTheDocument();
      expect(
        within(list).queryByText("The Woods Are Dark"),
      ).not.toBeInTheDocument();
    });

    it("filters by kind", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ kind: "Novel", title: "A Novel" }),
        createAuthorTitleValue({ kind: "Collection", title: "A Collection" }),
        createAuthorTitleValue({
          kind: "Non-Fiction",
          title: "Non-Fiction Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickKindFilterOption(user, "Novel");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("A Novel")).toBeInTheDocument();
      expect(within(list).queryByText("A Collection")).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Non-Fiction Book"),
      ).not.toBeInTheDocument();
    });

    it("filters by grade range", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          grade: "F",
          gradeValue: 1,
          title: "Bad Book",
        }),
        createAuthorTitleValue({
          grade: "B",
          gradeValue: 9,
          title: "Good Book",
        }),
        createAuthorTitleValue({
          grade: "A+",
          gradeValue: 13,
          title: "Great Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Good Book")).toBeInTheDocument();
      expect(within(list).getByText("Great Book")).toBeInTheDocument();
      expect(within(list).queryByText("Bad Book")).not.toBeInTheDocument();
    });

    it("filters by work year range", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ title: "Old Book", workYear: "1980" }),
        createAuthorTitleValue({ title: "Mid Book", workYear: "1990" }),
        createAuthorTitleValue({ title: "New Book", workYear: "2000" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillWorkYearFilter(user, "1985", "1995");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Mid Book")).toBeInTheDocument();
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();
      expect(within(list).queryByText("New Book")).not.toBeInTheDocument();
    });

    it("filters by review year", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ reviewYear: "2022", title: "2022 Review" }),
        createAuthorTitleValue({ reviewYear: "2023", title: "2023 Review" }),
        createAuthorTitleValue({ reviewYear: "2024", title: "2024 Review" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2023", "2023");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("2023 Review")).toBeInTheDocument();
      expect(within(list).queryByText("2022 Review")).not.toBeInTheDocument();
      expect(within(list).queryByText("2024 Review")).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A to Z", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ sortTitle: "zebra", title: "Zebra Book" }),
        createAuthorTitleValue({ sortTitle: "alpha", title: "Alpha Book" }),
        createAuthorTitleValue({ sortTitle: "middle", title: "Middle Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (A → Z)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const alphaIndex = allText.indexOf("Alpha Book");
      const middleIndex = allText.indexOf("Middle Book");
      const zebraIndex = allText.indexOf("Zebra Book");

      expect(alphaIndex).toBeLessThan(middleIndex);
      expect(middleIndex).toBeLessThan(zebraIndex);
    });

    it("sorts by title Z to A", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ sortTitle: "alpha", title: "Alpha Book" }),
        createAuthorTitleValue({ sortTitle: "zebra", title: "Zebra Book" }),
        createAuthorTitleValue({ sortTitle: "middle", title: "Middle Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (Z → A)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const alphaIndex = allText.indexOf("Alpha Book");
      const middleIndex = allText.indexOf("Middle Book");
      const zebraIndex = allText.indexOf("Zebra Book");

      expect(zebraIndex).toBeLessThan(middleIndex);
      expect(middleIndex).toBeLessThan(alphaIndex);
    });

    it("sorts by work year oldest first", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          title: "Modern Book",
          workYear: "2000",
        }),
        createAuthorTitleValue({
          title: "Classic Book",
          workYear: "1980",
        }),
        createAuthorTitleValue({
          title: "Mid Book",
          workYear: "1990",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Work Year (Oldest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";

      // When sorted by work year, items are sorted by workYearSequence
      const classicIndex = allText.indexOf("Classic Book");
      const midIndex = allText.indexOf("Mid Book");
      const modernIndex = allText.indexOf("Modern Book");

      expect(classicIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(modernIndex);
    });

    it("sorts by work year newest first", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          title: "Classic Book",
          workYear: "1980",
        }),
        createAuthorTitleValue({
          title: "Modern Book",
          workYear: "2000",
        }),
        createAuthorTitleValue({
          title: "Mid Book",
          workYear: "1990",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Work Year (Newest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";

      // When sorted by work year, items are sorted by workYearSequence in reverse
      const classicIndex = allText.indexOf("Classic Book");
      const midIndex = allText.indexOf("Mid Book");
      const modernIndex = allText.indexOf("Modern Book");

      expect(modernIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(classicIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          grade: "C",
          gradeValue: 6,
          title: "Okay Book",
        }),
        createAuthorTitleValue({
          grade: "A+",
          gradeValue: 13,
          title: "Great Book",
        }),
        createAuthorTitleValue({
          grade: "F",
          gradeValue: 1,
          title: "Bad Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Best First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const greatIndex = allText.indexOf("Great Book");
      const okayIndex = allText.indexOf("Okay Book");
      const badIndex = allText.indexOf("Bad Book");

      expect(greatIndex).toBeLessThan(okayIndex);
      expect(okayIndex).toBeLessThan(badIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          grade: "A+",
          gradeValue: 13,
          title: "Great Book",
        }),
        createAuthorTitleValue({
          grade: "F",
          gradeValue: 1,
          title: "Bad Book",
        }),
        createAuthorTitleValue({
          grade: "C",
          gradeValue: 6,
          title: "Okay Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Worst First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const greatIndex = allText.indexOf("Great Book");
      const okayIndex = allText.indexOf("Okay Book");
      const badIndex = allText.indexOf("Bad Book");

      expect(badIndex).toBeLessThan(okayIndex);
      expect(okayIndex).toBeLessThan(greatIndex);
    });

    it("sorts by review date newest first", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          reviewDate: new Date("2022-01-01"),
          reviewSequence: "1",
          title: "Old Review",
        }),
        createAuthorTitleValue({
          reviewDate: new Date("2024-01-01"),
          reviewSequence: "3",
          title: "New Review",
        }),
        createAuthorTitleValue({
          reviewDate: new Date("2023-01-01"),
          reviewSequence: "2",
          title: "Mid Review",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const oldIndex = allText.indexOf("Old Review");
      const midIndex = allText.indexOf("Mid Review");
      const newIndex = allText.indexOf("New Review");

      expect(newIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(oldIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          reviewDate: new Date("2024-01-01"),
          reviewSequence: "3",
          title: "New Review",
        }),
        createAuthorTitleValue({
          reviewDate: new Date("2022-01-01"),
          reviewSequence: "1",
          title: "Old Review",
        }),
        createAuthorTitleValue({
          reviewDate: new Date("2023-01-01"),
          reviewSequence: "2",
          title: "Mid Review",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const oldIndex = allText.indexOf("Old Review");
      const midIndex = allText.indexOf("Mid Review");
      const newIndex = allText.indexOf("New Review");

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });

  describe("pagination", () => {
    it("shows more items when button is clicked", async ({ expect }) => {
      // Create many test items to trigger pagination (need more than 100)
      const manyTitles = Array.from({ length: 150 }, (_, i) =>
        createAuthorTitleValue({ title: `Book ${i + 1}` }),
      );

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={manyTitles} />);

      const list = getGroupedCoverList();

      // Initially should show first 100 items
      expect(within(list).getByText("Book 1")).toBeInTheDocument();
      expect(within(list).getByText("Book 100")).toBeInTheDocument();
      expect(within(list).queryByText("Book 101")).not.toBeInTheDocument();

      // Click Show More to load more items
      await clickShowMore(user);

      // Now should show more items
      expect(within(list).getByText("Book 101")).toBeInTheDocument();
      expect(within(list).getByText("Book 150")).toBeInTheDocument();
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ kind: "Novel", title: "The Cellar" }),
        createAuthorTitleValue({ kind: "Collection", title: "Night Show" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "The Cellar");
      await clickKindFilterOption(user, "Novel");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("The Cellar")).toBeInTheDocument();
      expect(within(list).queryByText("Night Show")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");
      expect(getKindFilter()).toHaveValue("All");

      await clickViewResults(user);

      expect(within(list).getByText("The Cellar")).toBeInTheDocument();
      expect(within(list).getByText("Night Show")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({ title: "The Cellar" }),
        createAuthorTitleValue({ title: "Night Show" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "The Cellar");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("The Cellar")).toBeInTheDocument();
      expect(within(list).queryByText("Night Show")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different Title");
      await clickCloseFilters(user);

      // Should still show originally filtered results
      expect(within(list).getByText("The Cellar")).toBeInTheDocument();
      expect(within(list).queryByText("Night Show")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("The Cellar");
    });
  });

  describe("multiple authors (co-authors)", () => {
    it("displays co-authors when present", ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          otherAuthors: [{ name: "Peter Straub" }],
          title: "The Talisman",
        }),
        createAuthorTitleValue({
          otherAuthors: [{ name: "Peter Straub" }],
          title: "Black House",
        }),
        createAuthorTitleValue({
          otherAuthors: [],
          title: "Solo Book",
        }),
      ];

      render(<AuthorTitles {...baseProps} values={titles} />);

      const list = getGroupedCoverList();

      // Check that co-author is displayed with proper formatting (appears twice for two books)
      const coAuthorElements = within(list).getAllByText(/with Peter Straub/);
      expect(coAuthorElements).toHaveLength(2);

      // Solo book should not have co-author text
      expect(within(list).queryByText(/Solo Book/)).toBeInTheDocument();
      const soloBookText = list.textContent || "";
      expect(soloBookText).toContain("Solo Book");
      // Make sure there's no "with" text for solo book
      const soloBookIndex = soloBookText.indexOf("Solo Book");
      const nextWithIndex = soloBookText.indexOf("with", soloBookIndex);
      const nextTitleIndex = Math.min(
        soloBookText.indexOf("The Talisman", soloBookIndex + 1),
        soloBookText.indexOf("Black House", soloBookIndex + 1),
      );
      // If there's a "with" after Solo Book, it should be after another title
      if (nextWithIndex !== -1 && nextTitleIndex > -1) {
        expect(nextWithIndex).toBeGreaterThan(nextTitleIndex);
      }
    });

    it("displays multiple co-authors when present", ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          otherAuthors: [{ name: "Second Author" }, { name: "Third Author" }],
          title: "Three-Author Book",
        }),
      ];

      render(<AuthorTitles {...baseProps} values={titles} />);

      const list = getGroupedCoverList();

      // Check that both co-authors are displayed with proper conjunction
      const listText = list.textContent || "";
      expect(listText).toContain("with Second Author");
      expect(listText).toContain("Third Author");
      // Should use "and" between the last two authors
      expect(
        within(list).getByText(/Second Author.*and.*Third Author/),
      ).toBeInTheDocument();
    });

    it("filters correctly with co-authored books", async ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          kind: "Novel",
          otherAuthors: [{ name: "Peter Straub" }],
          title: "The Talisman",
        }),
        createAuthorTitleValue({
          kind: "Collection",
          otherAuthors: [],
          title: "Different Seasons",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AuthorTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickKindFilterOption(user, "Novel");
      await clickViewResults(user);

      const list = getGroupedCoverList();

      // Should show co-authored novel
      expect(within(list).getByText("The Talisman")).toBeInTheDocument();
      expect(within(list).getByText(/with Peter Straub/)).toBeInTheDocument();

      // Should not show solo collection
      expect(
        within(list).queryByText("Different Seasons"),
      ).not.toBeInTheDocument();
    });
  });
});
