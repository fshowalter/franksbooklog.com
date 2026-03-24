import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getCoverList } from "~/components/react/cover-list/CoverList.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/react/filter-and-sort-container/FilterAndSortContainer.testHelper";
import {
  clickKindFilterOption,
  fillTitleFilter,
  getKindFilter,
  getTitleFilter,
} from "~/components/react/reviewed-work-filters/ReviewedWorkFilters.testHelper";
import { authorFacetTests } from "~/facets/author/authorFacetTests";
import {
  gradeFilterFacetTests,
  gradeSortFacetTests,
} from "~/facets/grade/gradeFacetTests";
import { kindFacetTests } from "~/facets/kind/kindFacetTests";
import { paginationFacetTests } from "~/facets/pagination/paginationFacetTests";
import {
  reviewYearFilterFacetTests,
  reviewYearSortFacetTests,
} from "~/facets/review-year/reviewYearFacetTests";
import { reviewedStatusFacetTests } from "~/facets/reviewed-status/reviewedStatusFacetTests";
import {
  titleFilterFacetTests,
  titleSortFacetTests,
} from "~/facets/title/titleFacetTests";
import {
  workYearFilterFacetTests,
  workYearSortFacetTests,
} from "~/facets/work-year/workYearFacetTests";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

import { Reviews } from "./Reviews";

function createReviewsValues(
  overrides: Partial<ReviewsValue>[] = [],
): ReviewsValue[] {
  return overrides.map((override, index) => {
    const title = override.title || `Test Review ${index}`;

    return {
      abandoned: false,
      authors: override.authors || [
        {
          name: `Test Author ${index}`,
          notes: undefined,
          sortName: `Author ${index}, Test`,
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
      reviewSequence: `2024-01-01-${index}`,
      reviewYear: "2024",
      slug: `test-review-${index}`,
      sortTitle: title.toLowerCase(),
      title,
      workYear: "1990",
      ...override,
    };
  });
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
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  titleFilterFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ sortTitle, title }) => ({ sortTitle, title })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  titleSortFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ sortTitle, title }) => ({ sortTitle, title })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  kindFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ kind, title }) => ({ kind, title })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  gradeFilterFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ grade, gradeValue, title }) => ({
        grade,
        gradeValue,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  gradeSortFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ grade, gradeValue, title }) => ({
        grade,
        gradeValue,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  workYearFilterFacetTests({
    distinctWorkYears: baseProps.distinctWorkYears,
    getList: getCoverList,
    renderItems: (items) => {
      const reviews = createReviewsValues(
        items.map(({ title, workYear }) => ({ title, workYear })),
      );
      render(<Reviews {...baseProps} values={reviews} />);
    },
  });

  workYearSortFacetTests({
    getList: getCoverList,
    renderItems: (items) => {
      const reviews = createReviewsValues(
        items.map(({ title, workYear }) => ({ title, workYear })),
      );
      render(<Reviews {...baseProps} values={reviews} />);
    },
  });

  reviewYearFilterFacetTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    getList: getCoverList,
    renderItems: (items) => {
      const reviews = createReviewsValues(
        items.map(({ reviewSequence, reviewYear, title }) => ({
          reviewSequence,
          reviewYear,
          title,
        })),
      );
      render(<Reviews {...baseProps} values={reviews} />);
    },
  });

  reviewYearSortFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ reviewSequence, reviewYear, title }) => ({
        reviewSequence,
        reviewYear,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  reviewedStatusFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ abandoned, grade, gradeValue, title }) => ({
        abandoned,
        grade,
        gradeValue,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  authorFacetTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ authors, title }) => ({
        authors: authors.map((a) => ({
          name: a.name,
          notes: a.notes,
          sortName: a.sortName,
        })),
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  paginationFacetTests(
    (titles) => {
      const reviews = createReviewsValues(titles.map((title) => ({ title })));
      render(<Reviews {...baseProps} values={reviews} />);
    },
    async (user) => clickSortOption(user, "Title (A → Z)"),
    getCoverList,
  );

  describe("multiple authors display", () => {
    it("displays all authors for works with multiple authors", ({ expect }) => {
      const reviews = createReviewsValues([
        {
          authors: [
            {
              name: "Terry Pratchett",
              notes: undefined,
              sortName: "Pratchett, Terry",
            },
            { name: "Neil Gaiman", notes: undefined, sortName: "Gaiman, Neil" },
          ],
          title: "Good Omens",
        },
      ]);
      render(<Reviews {...baseProps} values={reviews} />);

      const list = getCoverList();
      expect(within(list).getByText(/Pratchett, Terry/)).toBeInTheDocument();
      expect(within(list).getByText(/Gaiman, Neil/)).toBeInTheDocument();
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const reviews = createReviewsValues([
        { kind: "Novel", title: "Dracula" },
        { kind: "Collection", title: "Night Show" },
      ]);

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickKindFilterOption(user, "Novel");
      await clickViewResults(user);

      const list = getCoverList();
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
      const reviews = createReviewsValues([
        { title: "Dracula" },
        { title: "The Shining" },
      ]);

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getCoverList();
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
