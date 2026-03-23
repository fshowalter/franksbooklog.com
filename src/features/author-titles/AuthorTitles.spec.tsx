import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getCoverList } from "~/components/cover-list/CoverList.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import {
  clickKindFilterOption,
  fillTitleFilter,
  getKindFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedWorkFilters.testHelper";
import { gradeFacetTests } from "~/facets/grade/gradeFacetTests";
import { kindFacetTests } from "~/facets/kind/kindFacetTests";
import { paginationFacetTests } from "~/facets/pagination/paginationFacetTests";
import { reviewYearFacetTests } from "~/facets/review-year/reviewYearFacetTests";
import { reviewedStatusFacetTests } from "~/facets/reviewed-status/reviewedStatusFacetTests";
import { titleFacetTests } from "~/facets/title/titleFacetTests";
import { workYearFacetTests } from "~/facets/work-year/workYearFacetTests";
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
    abandoned: false,
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
    reviewed: true,
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

  titleFacetTests((items) => {
    const titles = items.map(({ sortTitle, title }) =>
      createAuthorTitleValue({ sortTitle, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  });

  kindFacetTests((items) => {
    const titles = items.map(({ kind, title }) =>
      createAuthorTitleValue({ kind, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  });

  gradeFacetTests((items) => {
    const titles = items.map(({ grade, gradeValue, title }) =>
      createAuthorTitleValue({ grade, gradeValue, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  });

  workYearFacetTests({
    distinctWorkYears: baseProps.distinctWorkYears,
    renderItems: (items) => {
      const titles = items.map(({ title, workYear }) =>
        createAuthorTitleValue({ title, workYear }),
      );
      render(<AuthorTitles {...baseProps} values={titles} />);
    },
  });

  reviewYearFacetTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    renderItems: (items) => {
      const titles = items.map(({ reviewSequence, reviewYear, title }) =>
        createAuthorTitleValue({ reviewSequence, reviewYear, title }),
      );
      render(<AuthorTitles {...baseProps} values={titles} />);
    },
  });

  reviewedStatusFacetTests((items) => {
    const titles = items.map(({ abandoned, grade, gradeValue, title }) =>
      createAuthorTitleValue({ abandoned, grade, gradeValue, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  });

  paginationFacetTests((titles) => {
    const values = titles.map((title) => createAuthorTitleValue({ title }));
    render(<AuthorTitles {...baseProps} values={values} />);
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

      const list = getCoverList();
      expect(within(list).getByText("The Cellar")).toBeInTheDocument();
      expect(within(list).queryByText("Night Show")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");
      expect(
        within(getKindFilter()).queryAllByRole("checkbox", { checked: true }),
      ).toHaveLength(0);

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

      const list = getCoverList();
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
          otherAuthors: [{ name: "Peter Straub", notes: undefined }],
          title: "The Talisman",
        }),
        createAuthorTitleValue({
          otherAuthors: [{ name: "Peter Straub", notes: undefined }],
          title: "Black House",
        }),
        createAuthorTitleValue({
          otherAuthors: [],
          title: "Solo Book",
        }),
      ];

      render(<AuthorTitles {...baseProps} values={titles} />);

      const list = getCoverList();

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

      expect(nextWithIndex).toBeGreaterThan(nextTitleIndex);
    });

    it("displays multiple co-authors when present", ({ expect }) => {
      const titles = [
        createAuthorTitleValue({
          otherAuthors: [
            { name: "Second Author", notes: "Editor" },
            { name: "Third Author", notes: undefined },
          ],
          title: "Three-Author Book",
        }),
      ];

      render(<AuthorTitles {...baseProps} values={titles} />);

      const list = getCoverList();

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
          otherAuthors: [{ name: "Peter Straub", notes: undefined }],
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

      const list = getCoverList();

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
