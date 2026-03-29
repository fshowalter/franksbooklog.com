import type { UserEvent } from "@testing-library/user-event";

import { within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";
import {
  clickPreviousMonthButton,
  getCalendar,
  queryPreviousMonthButton,
} from "~/features/reading-log/ReadingLog.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./readingYearFilter";

type ReadingYearFilterItem = FilterableValue & {
  readingDate: string;
  title: string;
};

export function readingYearFilterTests({
  renderItems,
}: {
  renderItems: (items: ReadingYearFilterItem[]) => void;
}) {
  describe("readingYearFilter", () => {
    it("filters by reading year range", async ({ expect }) => {
      renderItems([
        {
          readingDate: "2012-03-01",
          readingYear: "2012",
          title: "Book 2012",
        },
        {
          readingDate: "2013-04-01",
          readingYear: "2013",
          title: "Book 2013",
        },
        {
          readingDate: "2014-05-01",
          readingYear: "2014",
          title: "Book 2014",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillReadingYearFilter(user, "2012", "2013");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Book 2013")).toBeInTheDocument();

      await clickPreviousMonthButton(user);
      expect(within(calendar).getByText("Book 2012")).toBeInTheDocument();

      const prevButton = queryPreviousMonthButton();
      expect(prevButton).not.toBeInTheDocument();
    });
  });
}

async function fillReadingYearFilter(
  user: UserEvent,
  year1: string,
  year2: string,
) {
  await fillYearField(user, "Reading Year", year1, year2);
}
