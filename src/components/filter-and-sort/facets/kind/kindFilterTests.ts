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

import type { FilterableValue } from "./kindFilter";

type KindItem = FilterableValue & {
  title: string;
};

export async function clickKindOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Kind");
  await clickCheckboxListFieldOption(filter, user, value);
}

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
export function kindFilterTests(
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
