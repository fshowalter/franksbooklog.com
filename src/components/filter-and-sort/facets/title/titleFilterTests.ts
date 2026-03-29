import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillTextField } from "~/components/filter-and-sort/fields/TextField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./titleFilter";

type TitleFilterItem = FilterableValue;

/**
 * Filter-only sub-suite for title. Use this for features that have a title
 * filter but no title sort (e.g. ReadingLog).
 */
export function titleFilterTests(
  renderItems: (items: TitleFilterItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("titleFilter", () => {
    it("filters to matching titles", async ({ expect }) => {
      renderItems([
        { title: "Dracula" },
        { title: "The Shining" },
        { title: "Pet Sematary" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();
      expect(within(list).queryByText("Pet Sematary")).not.toBeInTheDocument();
    });

    it("resets when closing drawer without applying", async ({ expect }) => {
      renderItems([{ title: "Dracula" }, { title: "The Shining" }]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different Title");
      await clickCloseFilters(user);

      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dracula");
    });
  });

  describe("title filter chip", () => {
    it("shows search chip after applying filter", async ({ expect }) => {
      renderItems([{ title: "Dracula" }, { title: "The Shining" }]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Search: Dracula filter" }),
      ).toBeInTheDocument();
    });

    it("removing title chip defers list update", async ({ expect }) => {
      renderItems([{ title: "Dracula" }, { title: "The Shining" }]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Search: Dracula filter" }),
      );

      expect(
        screen.queryByRole("button", { name: "Remove Search: Dracula filter" }),
      ).not.toBeInTheDocument();
      // List still filtered (activeFilterValues not yet cleared)
      expect(within(list).queryByText("The Shining")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("The Shining")).toBeInTheDocument();
    });
  });
}

async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

function getTitleFilter() {
  return screen.getByLabelText("Title");
}
