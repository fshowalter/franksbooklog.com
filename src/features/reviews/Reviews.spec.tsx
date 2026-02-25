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

import type { ReviewsProps, ReviewsValue } from "./Reviews";

import { Reviews } from "./Reviews";

// Test helpers
let testIdCounter = 0;

function createReviewValue(
  overrides: Partial<ReviewsValue> = {},
): ReviewsValue {
  testIdCounter += 1;
  const title = overrides.title || `Test Review ${testIdCounter}`;
  return {
    abandoned: false,
    authors: overrides.authors || [
      {
        name: `Test Author ${testIdCounter}`,
        sortName: `author ${testIdCounter.toLocaleString("en-US", { minimumIntegerDigits: 3 })}`,
      },
    ],
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
    reviewSequence: testIdCounter.toLocaleString("en-US", {
      minimumIntegerDigits: 3,
    }),
    reviewYear: "2024",
    slug: `test-review-${testIdCounter}`,
    sortTitle: title.toLowerCase(),
    title,
    workYear: "1990",
    ...overrides,
  };
}

function resetTestIdCounter(): void {
  testIdCounter = 0;
}

const baseProps: ReviewsProps = {
  distinctKinds: ["All", "Novel", "Collection", "Non-Fiction", "Short Story"],
  distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
  distinctWorkYears: ["1980", "1985", "1990", "1995", "2000", "2005", "2010"],
  initialSort: "author-asc",
  values: [],
};

describe("Reviews", () => {
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
      const reviews = [
        createReviewValue({ title: "Dracula" }),
        createReviewValue({ title: "The Shining" }),
        createReviewValue({ title: "Pet Sematary" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();
      expect(within(list).queryByText("Pet Sematary")).not.toBeInTheDocument();
    });

    it("filters by kind", async ({ expect }) => {
      const reviews = [
        createReviewValue({ kind: "Novel", title: "A Novel" }),
        createReviewValue({ kind: "Collection", title: "A Collection" }),
        createReviewValue({ kind: "Non-Fiction", title: "Non-Fiction Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

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
      const reviews = [
        createReviewValue({ grade: "F", gradeValue: 3, title: "Bad Book" }),
        createReviewValue({ grade: "B", gradeValue: 12, title: "Good Book" }),
        createReviewValue({ grade: "A+", gradeValue: 16, title: "Great Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Good Book")).toBeInTheDocument();
      expect(within(list).getByText("Great Book")).toBeInTheDocument();
      expect(within(list).queryByText("Bad Book")).not.toBeInTheDocument();
    });

    it("filters by work year range", async ({ expect }) => {
      const reviews = [
        createReviewValue({ title: "Old Book", workYear: "1980" }),
        createReviewValue({ title: "Mid Book", workYear: "1990" }),
        createReviewValue({ title: "New Book", workYear: "2000" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillWorkYearFilter(user, "1985", "1995");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Mid Book")).toBeInTheDocument();
      expect(within(list).queryByText("Old Book")).not.toBeInTheDocument();
      expect(within(list).queryByText("New Book")).not.toBeInTheDocument();
    });

    it("filters by review year", async ({ expect }) => {
      const reviews = [
        createReviewValue({ reviewYear: "2022", title: "2022 Review" }),
        createReviewValue({ reviewYear: "2023", title: "2023 Review" }),
        createReviewValue({ reviewYear: "2024", title: "2024 Review" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2023", "2023");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("2023 Review")).toBeInTheDocument();
      expect(within(list).queryByText("2022 Review")).not.toBeInTheDocument();
      expect(within(list).queryByText("2024 Review")).not.toBeInTheDocument();
    });
  });

  describe("multiple authors", () => {
    it("displays all authors for works with multiple authors", ({ expect }) => {
      const reviews = [
        createReviewValue({
          authors: [
            { name: "Terry Pratchett", sortName: "pratchett, terry" },
            { name: "Neil Gaiman", sortName: "gaiman, neil" },
          ],
          title: "Good Omens",
        }),
        createReviewValue({
          authors: [
            { name: "Stephen King", sortName: "king, stephen" },
            { name: "Peter Straub", sortName: "straub, peter" },
          ],
          title: "The Talisman",
        }),
      ];

      render(<Reviews {...baseProps} values={reviews} />);

      const list = getGroupedCoverList();

      // Check that all authors are displayed with proper formatting
      expect(within(list).getByText(/Terry Pratchett/)).toBeInTheDocument();
      expect(within(list).getByText(/Neil Gaiman/)).toBeInTheDocument();
      expect(within(list).getByText(/Stephen King/)).toBeInTheDocument();
      expect(within(list).getByText(/Peter Straub/)).toBeInTheDocument();
    });

    it("sorts by first author when multiple authors exist", async ({
      expect,
    }) => {
      const reviews = [
        createReviewValue({
          authors: [
            { name: "Zelda Fitzgerald", sortName: "fitzgerald, zelda" },
            { name: "Arthur Conan Doyle", sortName: "doyle, arthur" },
          ],
          title: "Book by Zelda and Arthur",
        }),
        createReviewValue({
          authors: [
            { name: "Arthur Conan Doyle", sortName: "doyle, arthur" },
            { name: "Zelda Fitzgerald", sortName: "fitzgerald, zelda" },
          ],
          title: "Book by Arthur and Zelda",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Author (A → Z)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";

      // The book with Arthur as first author should appear first
      const arthurFirstIndex = allText.indexOf("Book by Arthur and Zelda");
      const zeldaFirstIndex = allText.indexOf("Book by Zelda and Arthur");

      expect(arthurFirstIndex).toBeLessThan(zeldaFirstIndex);
    });
  });

  describe("sorting", () => {
    it("sorts by author A to Z", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          authors: [
            { name: "Zelda Fitzgerald", sortName: "fitzgerald, zelda" },
          ],
          title: "Zombie Book",
        }),
        createReviewValue({
          authors: [
            { name: "Arthur Conan Doyle", sortName: "doyle, arthur conan" },
          ],
          title: "Detective Book",
        }),
        createReviewValue({
          authors: [{ name: "Mary Shelley", sortName: "shelley, mary" }],
          title: "Monster Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Author (A → Z)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const arthurIndex = allText.indexOf("Arthur Conan Doyle");
      const maryIndex = allText.indexOf("Mary Shelley");
      const zeldaIndex = allText.indexOf("Zelda Fitzgerald");

      expect(arthurIndex).toBeLessThan(zeldaIndex);
      expect(zeldaIndex).toBeLessThan(maryIndex);
    });

    it("sorts by author Z to A", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          authors: [
            { name: "Arthur Conan Doyle", sortName: "doyle, arthur conan" },
          ],
          title: "Detective Book",
        }),
        createReviewValue({
          authors: [
            { name: "Zelda Fitzgerald", sortName: "fitzgerald, zelda" },
          ],
          title: "Zombie Book",
        }),
        createReviewValue({
          authors: [{ name: "Mary Shelley", sortName: "shelley, mary" }],
          title: "Monster Book",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Author (Z → A)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const arthurIndex = allText.indexOf("Arthur Conan Doyle");
      const maryIndex = allText.indexOf("Mary Shelley");
      const zeldaIndex = allText.indexOf("Zelda Fitzgerald");

      expect(maryIndex).toBeLessThan(zeldaIndex);
      expect(zeldaIndex).toBeLessThan(arthurIndex);
    });

    it("sorts by title A to Z", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "zebra", title: "Zebra Book" }),
        createReviewValue({ sortTitle: "alpha", title: "Alpha Book" }),
        createReviewValue({ sortTitle: "middle", title: "Middle Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

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
      const reviews = [
        createReviewValue({ sortTitle: "alpha", title: "Alpha Book" }),
        createReviewValue({ sortTitle: "zebra", title: "Zebra Book" }),
        createReviewValue({ sortTitle: "middle", title: "Middle Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

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
      const reviews = [
        createReviewValue({
          title: "Modern Book",
          workYear: "2000",
        }),
        createReviewValue({
          title: "Classic Book",
          workYear: "1980",
        }),
        createReviewValue({
          title: "Mid Book",
          workYear: "1990",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Work Year (Oldest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";

      const classicIndex = allText.indexOf("Classic Book");
      const midIndex = allText.indexOf("Mid Book");
      const modernIndex = allText.indexOf("Modern Book");

      expect(classicIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(modernIndex);
    });

    it("sorts by work year newest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          title: "Classic Book",
          workYear: "1980",
        }),
        createReviewValue({
          title: "Modern Book",
          workYear: "2000",
        }),
        createReviewValue({
          title: "Mid Book",
          workYear: "1990",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Work Year (Newest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";

      const classicIndex = allText.indexOf("Classic Book");
      const midIndex = allText.indexOf("Mid Book");
      const modernIndex = allText.indexOf("Modern Book");

      expect(modernIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(classicIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "C", gradeValue: 6, title: "Okay Book" }),
        createReviewValue({ grade: "A+", gradeValue: 13, title: "Great Book" }),
        createReviewValue({ grade: "F", gradeValue: 1, title: "Bad Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

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
      const reviews = [
        createReviewValue({ grade: "A+", gradeValue: 13, title: "Great Book" }),
        createReviewValue({ grade: "F", gradeValue: 1, title: "Bad Book" }),
        createReviewValue({ grade: "C", gradeValue: 6, title: "Okay Book" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

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
      const reviews = [
        createReviewValue({ reviewSequence: "3", title: "New Review" }),
        createReviewValue({ reviewSequence: "1", title: "Old Review" }),
        createReviewValue({ reviewSequence: "2", title: "Mid Review" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const newIndex = allText.indexOf("New Review");
      const midIndex = allText.indexOf("Mid Review");
      const oldIndex = allText.indexOf("Old Review");

      expect(newIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(oldIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ reviewSequence: "3", title: "New Review" }),
        createReviewValue({ reviewSequence: "1", title: "Old Review" }),
        createReviewValue({ reviewSequence: "2", title: "Mid Review" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const list = getGroupedCoverList();
      const allText = list.textContent || "";
      const newIndex = allText.indexOf("New Review");
      const midIndex = allText.indexOf("Mid Review");
      const oldIndex = allText.indexOf("Old Review");

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });

  describe("pagination", () => {
    it("shows more items when button is clicked", async ({ expect }) => {
      // Create many test items to trigger pagination (need more than 100)
      const manyReviews = Array.from({ length: 150 }, (_, i) =>
        createReviewValue({ title: `Book ${i + 1}` }),
      );

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={manyReviews} />);

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
      const reviews = [
        createReviewValue({ kind: "Novel", title: "Dracula" }),
        createReviewValue({ kind: "Collection", title: "Night Show" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickKindFilterOption(user, "Novel");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("Night Show")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");
      expect(
        within(getKindFilter()).queryAllByRole("checkbox", { checked: true }),
      ).toHaveLength(0);

      await clickViewResults(user);

      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).getByText("Night Show")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const reviews = [
        createReviewValue({ title: "Dracula" }),
        createReviewValue({ title: "The Shining" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getGroupedCoverList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different Title");
      await clickCloseFilters(user);

      // Should still show originally filtered results
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dracula");
    });
  });
});
