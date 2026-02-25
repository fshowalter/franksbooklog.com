import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import {
  fillNameFilter,
  getNameFilter,
} from "~/components/filter-and-sort/CollectionFilters.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { AuthorsProps, AuthorsValue } from "./Authors";

import { Authors } from "./Authors";

// Test helpers
let testIdCounter = 0;

function createAuthorValue(
  overrides: Partial<AuthorsValue> = {},
): AuthorsValue {
  testIdCounter += 1;
  const name = overrides.name || `Test Author ${testIdCounter}`;
  return {
    avatarImageProps: undefined,
    name,
    reviewCount: 5,
    slug: `test-author-${testIdCounter}`,
    sortName: name.toLowerCase(),
    ...overrides,
  };
}

function resetTestIdCounter(): void {
  testIdCounter = 0;
}

const baseProps: AuthorsProps = {
  initialSort: "name-asc",
  values: [],
};

describe("Authors", () => {
  beforeEach(() => {
    resetTestIdCounter();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by name", async ({ expect }) => {
      const authors = [
        createAuthorValue({ name: "Bram Stoker" }),
        createAuthorValue({ name: "Stephen King" }),
        createAuthorValue({ name: "Anne Rice" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).queryByText("Stephen King")).not.toBeInTheDocument();
      expect(within(list).queryByText("Anne Rice")).not.toBeInTheDocument();
    });

    it("filters by partial name match", async ({ expect }) => {
      const authors = [
        createAuthorValue({ name: "H.P. Lovecraft" }),
        createAuthorValue({ name: "H.G. Wells" }),
        createAuthorValue({ name: "Edgar Allan Poe" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "H.");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("H.P. Lovecraft")).toBeInTheDocument();
      expect(within(list).getByText("H.G. Wells")).toBeInTheDocument();
      expect(
        within(list).queryByText("Edgar Allan Poe"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by name A to Z", async ({ expect }) => {
      const authors = [
        createAuthorValue({
          name: "Zelda Fitzgerald",
          sortName: "fitzgerald, zelda",
        }),
        createAuthorValue({
          name: "Arthur Conan Doyle",
          sortName: "doyle, arthur conan",
        }),
        createAuthorValue({ name: "Mary Shelley", sortName: "shelley, mary" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickSortOption(user, "Name (A → Z)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const arthurIndex = allText.indexOf("Arthur Conan Doyle");
      const maryIndex = allText.indexOf("Mary Shelley");
      const zeldaIndex = allText.indexOf("Zelda Fitzgerald");

      expect(arthurIndex).toBeLessThan(maryIndex);
      expect(maryIndex).toBeLessThan(zeldaIndex);
    });

    it("sorts by name Z to A", async ({ expect }) => {
      const authors = [
        createAuthorValue({
          name: "Arthur Conan Doyle",
          sortName: "doyle, arthur conan",
        }),
        createAuthorValue({
          name: "Zelda Fitzgerald",
          sortName: "fitzgerald, zelda",
        }),
        createAuthorValue({ name: "Mary Shelley", sortName: "shelley, mary" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickSortOption(user, "Name (Z → A)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const arthurIndex = allText.indexOf("Arthur Conan Doyle");
      const maryIndex = allText.indexOf("Mary Shelley");
      const zeldaIndex = allText.indexOf("Zelda Fitzgerald");

      expect(zeldaIndex).toBeLessThan(maryIndex);
      expect(maryIndex).toBeLessThan(arthurIndex);
    });

    it("sorts by review count fewest first", async ({ expect }) => {
      const authors = [
        createAuthorValue({ name: "Popular Author", reviewCount: 20 }),
        createAuthorValue({ name: "New Author", reviewCount: 1 }),
        createAuthorValue({ name: "Mid Author", reviewCount: 10 }),
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
        createAuthorValue({ name: "New Author", reviewCount: 1 }),
        createAuthorValue({ name: "Popular Author", reviewCount: 20 }),
        createAuthorValue({ name: "Mid Author", reviewCount: 10 }),
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
        createAuthorValue({ name: "Bram Stoker" }),
        createAuthorValue({ name: "Stephen King" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).queryByText("Stephen King")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getNameFilter()).toHaveValue("");

      await clickViewResults(user);

      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).getByText("Stephen King")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const authors = [
        createAuthorValue({ name: "Bram Stoker" }),
        createAuthorValue({ name: "Stephen King" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).queryByText("Stephen King")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillNameFilter(user, "Different Author");
      await clickCloseFilters(user);

      // Should still show originally filtered results
      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).queryByText("Stephen King")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getNameFilter()).toHaveValue("Bram Stoker");
    });
  });

  describe("applied filters", () => {
    it("shows search chip in drawer after applying name filter", async ({
      expect,
    }) => {
      const authors = [
        createAuthorValue({ name: "Bram Stoker" }),
        createAuthorValue({ name: "Stephen King" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: "Remove Search: Bram Stoker filter",
        }),
      ).toBeInTheDocument();
    });

    it("removing name chip immediately hides chip but defers list update until View Results", async ({
      expect,
    }) => {
      const authors = [
        createAuthorValue({ name: "Bram Stoker" }),
        createAuthorValue({ name: "Stephen King" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Authors {...baseProps} values={authors} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      const list = getGroupedAvatarList();
      expect(within(list).queryByText("Stephen King")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: "Remove Search: Bram Stoker filter",
        }),
      );

      // Chip is gone immediately from the Applied Filters section
      expect(
        screen.queryByRole("button", {
          name: "Remove Search: Bram Stoker filter",
        }),
      ).not.toBeInTheDocument();
      // But the list is not yet updated — "View Results" hasn't been clicked
      expect(within(list).queryByText("Stephen King")).not.toBeInTheDocument();

      await clickViewResults(user);

      // Now the list updates
      expect(within(list).getByText("Stephen King")).toBeInTheDocument();
    });
  });
});
