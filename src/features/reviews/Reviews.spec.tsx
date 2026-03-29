import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getCoverList } from "~/components/cover-list/CoverList.testHelper";
import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { authorSortTests } from "~/components/filter-and-sort/facets/author/authorSortTests";
import { gradeFilterTests } from "~/components/filter-and-sort/facets/grade/gradeFilterTests";
import { gradeSortTests } from "~/components/filter-and-sort/facets/grade/gradeSortTests";
import { kindFilterTests } from "~/components/filter-and-sort/facets/kind/kindFilterTests";
import { reviewDateSortTests } from "~/components/filter-and-sort/facets/review-date/reviewDateSortTests";
import { reviewYearFilterTests } from "~/components/filter-and-sort/facets/review-year/reviewYearFilterTests";
import { reviewedStatusFilterTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterTests";
import { titleYearFilterTests } from "~/components/filter-and-sort/facets/title-year/titleYearFilterTests";
import { titleYearSortTests } from "~/components/filter-and-sort/facets/title-year/titleYearSortTests";
import { titleFilterTests } from "~/components/filter-and-sort/facets/title/titleFilterTests";
import { titleSortTests } from "~/components/filter-and-sort/facets/title/titleSortTests";
import { paginationTests } from "~/components/filter-and-sort/paginated-list/paginationTests";

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
      titleYear: "1990",
      ...override,
    };
  });
}

const baseProps: ReviewsProps = {
  distinctKinds: ["All", "Novel", "Collection", "Non-Fiction", "Short Story"],
  distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
  distinctTitleYears: ["1980", "1985", "1990", "1995", "2000", "2005", "2010"],
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

  titleFilterTests((items) => {
    const reviews = createReviewsValues(items.map(({ title }) => ({ title })));
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  titleSortTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ sortTitle, title }) => ({ sortTitle, title })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  kindFilterTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ kind, title }) => ({ kind, title })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  gradeFilterTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ grade, gradeValue, title }) => ({
        grade,
        gradeValue,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  gradeSortTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ gradeValue, title }) => ({
        gradeValue,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  titleYearFilterTests({
    distinctTitleYears: baseProps.distinctTitleYears,
    getList: getCoverList,
    renderItems: (items) => {
      const reviews = createReviewsValues(
        items.map(({ title, titleYear }) => ({ title, titleYear })),
      );
      render(<Reviews {...baseProps} values={reviews} />);
    },
  });

  titleYearSortTests({
    getList: getCoverList,
    renderItems: (items) => {
      const reviews = createReviewsValues(
        items.map(({ title, titleYear }) => ({ title, titleYear })),
      );
      render(<Reviews {...baseProps} values={reviews} />);
    },
  });

  reviewYearFilterTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    getList: getCoverList,
    renderItems: (items) => {
      const reviews = createReviewsValues(
        items.map(({ reviewYear, title }) => ({
          reviewYear,
          title,
        })),
      );
      render(<Reviews {...baseProps} values={reviews} />);
    },
  });

  reviewDateSortTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ reviewSequence, reviewYear, title }) => ({
        reviewSequence,
        reviewYear,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  reviewedStatusFilterTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ abandoned, title }) => ({
        abandoned,
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  authorSortTests((items) => {
    const reviews = createReviewsValues(
      items.map(({ authors, title }) => ({
        authors: authors.map((a) => ({
          name: a.sortName,
          notes: undefined,
          sortName: a.sortName,
        })),
        title,
      })),
    );
    render(<Reviews {...baseProps} values={reviews} />);
  }, getCoverList);

  paginationTests(
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
});
