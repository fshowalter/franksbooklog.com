import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import { getGroupedAvatarList } from "~/components/react/avatar-list/AvatarList.testHelper";
import {
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/react/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillTextField } from "~/components/react/filter-and-sort/fields/TextField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type NameItem = {
  name: string;
  sortName: string;
};

export async function fillNameFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Name", value);
}

export function getNameFilter() {
  return screen.getByLabelText("Name");
}

/**
 * Shared test suite for the name filter facet.
 * Call this inside a feature's describe block, passing a render adapter
 * that creates the minimum required values and renders the feature component.
 *
 * @example
 * nameFacetTests((items) => {
 *   const values = items.map(({ name, sortName }) => createAuthorValue(sortName, { name }));
 *   render(<Authors {...baseProps} values={values} />);
 * });
 */
export function nameFacetTests(renderItems: (items: NameItem[]) => void) {
  describe("name filter", () => {
    it("filters to matching names", async ({ expect }) => {
      renderItems([
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Stephen King", sortName: "King, Stephen" },
        { name: "Anne Rice", sortName: "Rice, Anne" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTextField(user, "Name", "Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Stoker, Bram")).toBeInTheDocument();
      expect(within(list).queryByText("King, Stephen")).not.toBeInTheDocument();
      expect(within(list).queryByText("Rice, Anne")).not.toBeInTheDocument();
    });

    it("filters by partial name match", async ({ expect }) => {
      renderItems([
        { name: "H.P. Lovecraft", sortName: "Lovecraft, H.P." },
        { name: "H.G. Wells", sortName: "Wells, H.G." },
        { name: "Edgar Allan Poe", sortName: "Poe, Edgar Allan" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTextField(user, "Name", "H.");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Lovecraft, H.P.")).toBeInTheDocument();
      expect(within(list).getByText("Wells, H.G.")).toBeInTheDocument();
      expect(
        within(list).queryByText("Poe, Edgar Allan"),
      ).not.toBeInTheDocument();
    });

    it("shows search chip after applying", async ({ expect }) => {
      renderItems([
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Stephen King", sortName: "King, Stephen" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTextField(user, "Name", "Bram Stoker");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: "Remove Search: Bram Stoker filter",
        }),
      ).toBeInTheDocument();
    });

    it("removing name chip defers list update until View Results", async ({
      expect,
    }) => {
      renderItems([
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Stephen King", sortName: "King, Stephen" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTextField(user, "Name", "Bram Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).queryByText("King, Stephen")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: "Remove Search: Bram Stoker filter",
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: "Remove Search: Bram Stoker filter",
        }),
      ).not.toBeInTheDocument();
      expect(within(list).queryByText("King, Stephen")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("King, Stephen")).toBeInTheDocument();
    });

    it("resets when closing drawer without applying", async ({ expect }) => {
      renderItems([
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Stephen King", sortName: "King, Stephen" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillTextField(user, "Name", "Bram Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Stoker, Bram")).toBeInTheDocument();
      expect(within(list).queryByText("King, Stephen")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTextField(user, "Name", "Different Author");
      await clickCloseFilters(user);

      expect(within(list).getByText("Stoker, Bram")).toBeInTheDocument();
      expect(within(list).queryByText("King, Stephen")).not.toBeInTheDocument();
    });
  });
}
