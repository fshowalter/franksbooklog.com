import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import type { GradeType, GradeValueType } from "~/utils/grades";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/react/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/react/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type ReviewedStatusItem = {
  abandoned: boolean;
  grade?: GradeType;
  gradeValue?: GradeValueType;
  title: string;
};

/**
 * Shared test suite for the reviewed status filter facet.
 *
 * @example
 * reviewedStatusFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 *
 * @example — with custom container (e.g. ReadingLog calendar)
 * reviewedStatusFacetTests((items) => { render(...) }, getCalendar);
 */
export function reviewedStatusFacetTests(
  renderItems: (items: ReviewedStatusItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("reviewed status filter", () => {
    it("filters to abandoned items", async ({ expect }) => {
      renderItems([
        {
          abandoned: true,
          grade: "Abandoned",
          gradeValue: 0,
          title: "Abandoned Book",
        },
        { abandoned: false, title: "Normal Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Abandoned");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Abandoned Book")).toBeInTheDocument();
      expect(within(list).queryByText("Normal Book")).not.toBeInTheDocument();
    });

    it("shows status chip after applying", async ({ expect }) => {
      renderItems([
        {
          abandoned: true,
          grade: "Abandoned",
          gradeValue: 0,
          title: "Abandoned Book",
        },
        { abandoned: false, title: "Normal Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Abandoned");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Abandoned filter" }),
      ).toBeInTheDocument();
    });
  });
}
