import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/react/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type KindItem = {
  kind: string;
  title: string;
};

/**
 * Shared test suite for the kind filter facet.
 *
 * @example
 * kindFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 *
 * @example — with custom container (e.g. ReadingLog calendar)
 * kindFacetTests((items) => { render(...) }, getCalendar);
 */
export function kindFacetTests(
  renderItems: (items: KindItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("kind filter", () => {
    it("filters to a single kind", async ({ expect }) => {
      renderItems([
        { kind: "Novel", title: "A Novel" },
        { kind: "Collection", title: "A Collection" },
        { kind: "Non-Fiction", title: "Non-Fiction Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickKindOption(user, "Novel");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("A Novel")).toBeInTheDocument();
      expect(within(list).queryByText("A Collection")).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Non-Fiction Book"),
      ).not.toBeInTheDocument();
    });

    it("filters to multiple kinds (OR logic)", async ({ expect }) => {
      renderItems([
        { kind: "Novel", title: "A Novel" },
        { kind: "Collection", title: "A Collection" },
        { kind: "Non-Fiction", title: "Non-Fiction Book" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickKindOption(user, "Novel");
      await clickKindOption(user, "Collection");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("A Novel")).toBeInTheDocument();
      expect(within(list).getByText("A Collection")).toBeInTheDocument();
      expect(
        within(list).queryByText("Non-Fiction Book"),
      ).not.toBeInTheDocument();
    });

    it("shows kind chip after applying", async ({ expect }) => {
      renderItems([
        { kind: "Novel", title: "A Novel" },
        { kind: "Collection", title: "A Collection" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickKindOption(user, "Novel");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Novel filter" }),
      ).toBeInTheDocument();
    });

    it("chip removal immediately hides chip but defers list update", async ({
      expect,
    }) => {
      renderItems([
        { kind: "Novel", title: "A Novel" },
        { kind: "Collection", title: "A Collection" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickKindOption(user, "Novel");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("A Collection")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Novel filter" }),
      );

      expect(
        screen.queryByRole("button", { name: "Remove Novel filter" }),
      ).not.toBeInTheDocument();
      expect(within(list).queryByText("A Collection")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("A Collection")).toBeInTheDocument();
    });
  });
}

async function clickKindOption(user: UserEvent, value: string) {
  const filter = screen.getByRole("group", { name: "Kind" });
  const showMore = within(filter).queryByRole("button", { name: /show more/i });
  if (showMore) await user.click(showMore);
  const checkboxes = within(filter).getAllByRole("checkbox");
  const cb = checkboxes.find((c) => (c as HTMLInputElement).value === value);
  if (!cb) throw new Error(`Kind checkbox "${value}" not found`);
  await user.click(cb);
}
