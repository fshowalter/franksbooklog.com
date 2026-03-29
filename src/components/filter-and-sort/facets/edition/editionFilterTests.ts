import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import { getAnimatedDetailsDisclosureElement } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure.testHelper";
import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickCheckboxListFieldOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./editionFilter";

type EditionItem = FilterableValue & {
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
export function editionFilterTests({
  getList,
  renderItems,
}: {
  getList: () => HTMLElement;
  renderItems: (items: EditionItem[]) => void;
}) {
  describe("editionFilter", () => {
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
  const filter = getAnimatedDetailsDisclosureElement("Edition");
  await clickCheckboxListFieldOption(filter, user, value);
}
