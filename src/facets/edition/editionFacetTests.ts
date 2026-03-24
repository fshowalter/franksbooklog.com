import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort-container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type EditionFacetAdapter = {
  getList: () => HTMLElement;
  renderItems: (items: EditionItem[]) => void;
};

type EditionItem = {
  edition: string;
  title: string;
};

/**
 * Shared test suite for the edition filter facet.
 *
 * @example
 * editionFacetTests({
 *   getList: getCalendar,
 *   renderItems: (items) => render(<ReadingLog {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function editionFacetTests({
  getList,
  renderItems,
}: EditionFacetAdapter) {
  describe("edition filter", () => {
    it("filters to a single edition", async ({ expect }) => {
      renderItems([
        { edition: "Paperback", title: "Book in Paperback" },
        { edition: "Hardcover", title: "Book in Hardcover" },
        { edition: "Kindle", title: "Book on Kindle" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickEditionOption(user, "Paperback");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Book in Paperback")).toBeInTheDocument();
      expect(
        within(list).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Book on Kindle"),
      ).not.toBeInTheDocument();
    });

    it("filters to multiple editions (OR logic)", async ({ expect }) => {
      renderItems([
        { edition: "Paperback", title: "Book in Paperback" },
        { edition: "Hardcover", title: "Book in Hardcover" },
        { edition: "Kindle", title: "Book on Kindle" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickEditionOption(user, "Paperback");
      await clickEditionOption(user, "Kindle");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Book in Paperback")).toBeInTheDocument();
      expect(within(list).getByText("Book on Kindle")).toBeInTheDocument();
      expect(
        within(list).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();
    });

    it("shows edition chip after applying", async ({ expect }) => {
      renderItems([
        { edition: "Paperback", title: "Book in Paperback" },
        { edition: "Hardcover", title: "Book in Hardcover" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickEditionOption(user, "Paperback");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Paperback filter" }),
      ).toBeInTheDocument();
    });

    it("chip removal immediately hides chip but defers list update", async ({
      expect,
    }) => {
      renderItems([
        { edition: "Paperback", title: "Book in Paperback" },
        { edition: "Hardcover", title: "Book in Hardcover" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickEditionOption(user, "Paperback");
      await clickViewResults(user);

      const list = getList();
      expect(
        within(list).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Paperback filter" }),
      );

      expect(
        screen.queryByRole("button", { name: "Remove Paperback filter" }),
      ).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Book in Hardcover"),
      ).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Book in Hardcover")).toBeInTheDocument();
    });
  });
}

async function clickEditionOption(user: UserEvent, value: string) {
  const filter = screen.getByRole("group", { name: "Edition" });
  const showMore = within(filter).queryByRole("button", { name: /show more/i });
  if (showMore) await user.click(showMore);
  const checkboxes = within(filter).getAllByRole("checkbox");
  const cb = checkboxes.find((c) => (c as HTMLInputElement).value === value);
  if (!cb) throw new Error(`Edition checkbox "${value}" not found`);
  await user.click(cb);
}
