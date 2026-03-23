import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import {
  fillNameFilter,
  getNameFilter,
} from "~/components/filter-and-sort/CollectionFilters.testHelper";
import {
  clickClearFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { nameFacetTests } from "~/facets/name/nameFacetTests";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { AuthorsProps, AuthorsValue } from "./Authors";

import { Authors } from "./Authors";

function createAuthorValue(
  sortName: string,
  overrides: Partial<AuthorsValue> = {},
): AuthorsValue {
  const names = sortName.split(",");

  return {
    avatarImageProps: undefined,
    name: `${names[1]} ${names[0]}`,
    reviewCount: 5,
    slug: sortName,
    sortName,
    ...overrides,
  };
}

const baseProps: AuthorsProps = {
  initialSort: "name-asc",
  values: [],
};

describe("Authors", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  nameFacetTests((items) => {
    const authors = items.map(({ name, sortName }) =>
      createAuthorValue(sortName, { name }),
    );
    render(<Authors {...baseProps} values={authors} />);
  });

  describe("sorting", () => {
    it("sorts by sort name A to Z", async ({ expect }) => {
      const authors = [
        createAuthorValue("Fitzgerald, Zelda"),
        createAuthorValue("Doyle, Arthur Conan"),
        createAuthorValue("Shelley, Mary"),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickSortOption(user, "Name (A → Z)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const doyleIndex = allText.indexOf("Doyle, Arthur Conan");
      const shellyIndex = allText.indexOf("Shelley, Mar");
      const fitzgeraldIndex = allText.indexOf("Fitzgerald, Zelda");

      expect(doyleIndex).toBeLessThan(fitzgeraldIndex);
      expect(fitzgeraldIndex).toBeLessThan(shellyIndex);
    });

    it("sorts by sort name Z to A", async ({ expect }) => {
      const authors = [
        createAuthorValue("Doyle, Arthur Conan"),
        createAuthorValue("Fitzgerald, Zelda"),
        createAuthorValue("Shelley, Mary"),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickSortOption(user, "Name (Z → A)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const doyleIndex = allText.indexOf("Doyle, Arthur Conan");
      const shellyIndex = allText.indexOf("Shelley, Mar");
      const fitzgeraldIndex = allText.indexOf("Fitzgerald, Zelda");

      expect(shellyIndex).toBeLessThan(fitzgeraldIndex);
      expect(fitzgeraldIndex).toBeLessThan(doyleIndex);
    });

    it("sorts by review count fewest first", async ({ expect }) => {
      const authors = [
        createAuthorValue("Popular Author", { reviewCount: 20 }),
        createAuthorValue("New Author", { reviewCount: 1 }),
        createAuthorValue("Mid Author", { reviewCount: 10 }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickSortOption(user, "Review Count (Fewest First)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const newIndex = allText.indexOf("New Author");
      const midIndex = allText.indexOf("Mid Author");
      const popularIndex = allText.indexOf("Popular Author");

      expect(newIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(popularIndex);
    });

    it("sorts by review count most first", async ({ expect }) => {
      const authors = [
        createAuthorValue("New Author", { reviewCount: 1 }),
        createAuthorValue("Popular Author", { reviewCount: 20 }),
        createAuthorValue("Mid Author", { reviewCount: 10 }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickSortOption(user, "Review Count (Most First)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const newIndex = allText.indexOf("New Author");
      const midIndex = allText.indexOf("Mid Author");
      const popularIndex = allText.indexOf("Popular Author");

      expect(popularIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const authors = [
        createAuthorValue("Stoker, Bram"),
        createAuthorValue("King, Stephen"),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Stoker, Bram")).toBeInTheDocument();
      expect(within(list).queryByText("King, Stephen")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getNameFilter()).toHaveValue("");

      await clickViewResults(user);

      expect(within(list).getByText("Stoker, Bram")).toBeInTheDocument();
      expect(within(list).getByText("King, Stephen")).toBeInTheDocument();
    });
  });
});
