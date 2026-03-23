import { within } from "@testing-library/react";
import { describe, it } from "vitest";

import { getCoverList } from "~/components/cover-list/CoverList.testHelper";
import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { fillReviewYearFilter } from "~/components/filter-and-sort/ReviewedWorkFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type ReviewYearFacetAdapter = {
  distinctReviewYears: readonly string[];
  renderItems: (items: ReviewYearItem[]) => void;
};

type ReviewYearItem = {
  reviewSequence: string;
  reviewYear: string;
  title: string;
};

/**
 * Shared test suite for the review year filter and sort facet.
 *
 * @example
 * reviewYearFacetTests({
 *   distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
 *   renderItems: (items) => render(<Reviews {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function reviewYearFacetTests({
  distinctReviewYears,
  renderItems,
}: ReviewYearFacetAdapter) {
  describe("review year filter", () => {
    it("filters to items within review year range", async ({ expect }) => {
      renderItems([
        { reviewSequence: "1", reviewYear: "2022", title: "2022 Review" },
        { reviewSequence: "2", reviewYear: "2023", title: "2023 Review" },
        { reviewSequence: "3", reviewYear: "2024", title: "2024 Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2023", "2023");
      await clickViewResults(user);

      const list = getCoverList();
      expect(within(list).getByText("2023 Review")).toBeInTheDocument();
      expect(within(list).queryByText("2022 Review")).not.toBeInTheDocument();
      expect(within(list).queryByText("2024 Review")).not.toBeInTheDocument();
    });
  });

  describe("review date sort", () => {
    it("sorts newest first", async ({ expect }) => {
      renderItems([
        { reviewSequence: "3", reviewYear: "2024", title: "New Review" },
        { reviewSequence: "1", reviewYear: "2022", title: "Old Review" },
        { reviewSequence: "2", reviewYear: "2023", title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Review Date (Newest First)");

      const list = getCoverList();
      const text = list.textContent ?? "";
      expect(text.indexOf("New Review")).toBeLessThan(
        text.indexOf("Mid Review"),
      );
      expect(text.indexOf("Mid Review")).toBeLessThan(
        text.indexOf("Old Review"),
      );
    });

    it("sorts oldest first", async ({ expect }) => {
      renderItems([
        { reviewSequence: "3", reviewYear: "2024", title: "New Review" },
        { reviewSequence: "1", reviewYear: "2022", title: "Old Review" },
        { reviewSequence: "2", reviewYear: "2023", title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Review Date (Oldest First)");

      const list = getCoverList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Old Review")).toBeLessThan(
        text.indexOf("Mid Review"),
      );
      expect(text.indexOf("Mid Review")).toBeLessThan(
        text.indexOf("New Review"),
      );
    });
  });

  // Suppress unused variable warning — distinctReviewYears is part of the
  // adapter interface for chip tests added in Stage 2.
  void distinctReviewYears;
}
