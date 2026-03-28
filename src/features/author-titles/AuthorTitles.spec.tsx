import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import {
  clickKindFilterOption,
  fillTitleFilter,
  getKindFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/facet-groups/TitleFacets.testHelper";
import {
  gradeFilterFacetTests,
  gradeSortFacetTests,
} from "~/components/filter-and-sort/facets/grade/gradeFacetTests";
import { kindFacetTests } from "~/components/filter-and-sort/facets/kind/kindFacetTests";
import {
  reviewYearFilterFacetTests,
  reviewYearSortFacetTests,
} from "~/components/filter-and-sort/facets/review-year/reviewYearFacetTests";
import { reviewedStatusFacetTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFacetTests";
import {
  titleYearFilterFacetTests,
  titleYearSortFacetTests,
} from "~/components/filter-and-sort/facets/title-year/titleYearFacetTests";
import {
  titleFilterFacetTests,
  titleSortFacetTests,
} from "~/components/filter-and-sort/facets/title/titleFacetTests";
import { paginationTests } from "~/components/filter-and-sort/paginated-list/paginationTests";
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
    excerptHtml: "Test excerptHtml",
    grade: "B+",
    gradeValue: 13,
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
    titleYear: "1990",
    ...overrides,
  };
}

function resetTestIdCounter(): void {
  testIdCounter = 0;
}

const baseProps: AuthorTitlesProps = {
  distinctKinds: ["All", "Novel", "Collection", "Non-Fiction", "Short Story"],
  distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
  distinctTitleYears: ["1980", "1985", "1990", "1995", "2000", "2005", "2010"],
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

  titleFilterFacetTests((items) => {
    const titles = items.map(({ sortTitle, title }) =>
      createAuthorTitleValue({ sortTitle, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

  titleSortFacetTests((items) => {
    const titles = items.map(({ sortTitle, title }) =>
      createAuthorTitleValue({ sortTitle, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

  kindFacetTests((items) => {
    const titles = items.map(({ kind, title }) =>
      createAuthorTitleValue({ kind, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

  gradeFilterFacetTests((items) => {
    const titles = items.map(({ grade, gradeValue, title }) =>
      createAuthorTitleValue({ grade, gradeValue, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

  gradeSortFacetTests((items) => {
    const titles = items.map(({ grade, gradeValue, title }) =>
      createAuthorTitleValue({ grade, gradeValue, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

  paginationTests(
    (titles) => {
      const values = titles.map((title) => createAuthorTitleValue({ title }));
      render(<AuthorTitles {...baseProps} values={values} />);
    },
    async (user) => clickSortOption(user, "Title (A → Z)"),
    getCardList,
  );

  titleYearFilterFacetTests({
    distinctTitleYears: baseProps.distinctTitleYears,
    getList: getCardList,
    renderItems: (items) => {
      const titles = items.map(({ title, titleYear }) =>
        createAuthorTitleValue({ title, titleYear }),
      );
      render(<AuthorTitles {...baseProps} values={titles} />);
    },
  });

  titleYearSortFacetTests({
    getList: getCardList,
    renderItems: (items) => {
      const titles = items.map(({ title, titleYear }) =>
        createAuthorTitleValue({ title, titleYear }),
      );
      render(<AuthorTitles {...baseProps} values={titles} />);
    },
  });

  reviewYearFilterFacetTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    getList: getCardList,
    renderItems: (items) => {
      const titles = items.map(({ reviewSequence, reviewYear, title }) =>
        createAuthorTitleValue({ reviewSequence, reviewYear, title }),
      );
      render(<AuthorTitles {...baseProps} values={titles} />);
    },
  });

  reviewYearSortFacetTests((items) => {
    const titles = items.map(({ reviewSequence, reviewYear, title }) =>
      createAuthorTitleValue({ reviewSequence, reviewYear, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

  reviewedStatusFacetTests((items) => {
    const titles = items.map(({ abandoned, grade, gradeValue, title }) =>
      createAuthorTitleValue({ abandoned, grade, gradeValue, title }),
    );
    render(<AuthorTitles {...baseProps} values={titles} />);
  }, getCardList);

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

      const list = getCardList();
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

      const list = getCardList();
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

      const list = getCardList();

      // Check that co-author is displayed with proper formatting (appears twice for two books)
      const coAuthorElements = within(list).getAllByText(/Peter Straub/);
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

      const list = getCardList();

      // Check that both co-authors are displayed with proper conjunction
      const listText = list.textContent || "";
      expect(listText).toContain("Second Author");
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

      const list = getCardList();

      // Should show co-authored novel
      expect(within(list).getByText("The Talisman")).toBeInTheDocument();
      expect(within(list).getByText(/Peter Straub/)).toBeInTheDocument();

      // Should not show solo collection
      expect(
        within(list).queryByText("Different Seasons"),
      ).not.toBeInTheDocument();
    });
  });
});

function getCardList(): HTMLElement {
  return screen.getByTestId("card-list");
}
