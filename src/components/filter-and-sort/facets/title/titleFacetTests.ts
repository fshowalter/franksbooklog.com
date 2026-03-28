import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import {
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/facet-groups/TitleFacets.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type TitleItem = {
  sortTitle: string;
  title: string;
};

/**
 * Filter-only sub-suite for title. Use this for features that have a title
 * filter but no title sort (e.g. ReadingLog).
 */
export function titleFilterFacetTests(
  renderItems: (items: TitleItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("title filter", () => {
    it("filters to matching titles", async ({ expect }) => {
      renderItems([
        { sortTitle: "dracula", title: "Dracula" },
        { sortTitle: "the shining", title: "The Shining" },
        { sortTitle: "pet sematary", title: "Pet Sematary" },
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
      renderItems([
        { sortTitle: "dracula", title: "Dracula" },
        { sortTitle: "the shining", title: "The Shining" },
      ]);

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
      renderItems([
        { sortTitle: "dracula", title: "Dracula" },
        { sortTitle: "the shining", title: "The Shining" },
      ]);

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
      renderItems([
        { sortTitle: "dracula", title: "Dracula" },
        { sortTitle: "the shining", title: "The Shining" },
      ]);

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

/**
 * Sort-only sub-suite for title. Use this for features that have title sort
 * (Reviews, AuthorTitles).
 */
export function titleSortFacetTests(
  renderItems: (items: TitleItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("title sort", () => {
    it("sorts A → Z", async ({ expect }) => {
      renderItems([
        { sortTitle: "zebra", title: "Zebra Book" },
        { sortTitle: "alpha", title: "Alpha Book" },
        { sortTitle: "middle", title: "Middle Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Title (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Alpha Book")).toBeLessThan(
        text.indexOf("Middle Book"),
      );
      expect(text.indexOf("Middle Book")).toBeLessThan(
        text.indexOf("Zebra Book"),
      );
    });

    it("sorts Z → A", async ({ expect }) => {
      renderItems([
        { sortTitle: "alpha", title: "Alpha Book" },
        { sortTitle: "zebra", title: "Zebra Book" },
        { sortTitle: "middle", title: "Middle Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Title (Z → A)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Zebra Book")).toBeLessThan(
        text.indexOf("Middle Book"),
      );
      expect(text.indexOf("Middle Book")).toBeLessThan(
        text.indexOf("Alpha Book"),
      );
    });
  });
}
