import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/AvatarList.testHelper";
import {
  fillNameFilter,
  getNameFilter,
} from "~/components/CollectionFilters.testHelper";
import { clickSortOption } from "~/components/ListWithFilters/ListWithFilters.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/testUtils";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

import { Authors } from "./Authors";
import { getProps } from "./getProps";

const props = await getProps();

describe("Authors", () => {
  beforeEach(() => {
    // AIDEV-NOTE: Using shouldAdvanceTime: true prevents userEvent from hanging
    // when fake timers are active. This allows async userEvent operations to complete
    // while still controlling timer advancement for debounced inputs.
    // See https://github.com/testing-library/user-event/issues/833
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    // AIDEV-NOTE: Clear all pending timers before restoring real timers
    // to ensure test isolation and prevent timer leaks between tests
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("can filter by name", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    await clickToggleFilters(user);

    await fillNameFilter(user, "Bram Stoker");

    await clickViewResults(user);

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by name z->a", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    await clickSortOption(user, "Name (Z → A)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by name a->z", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    await clickSortOption(user, "Name (A → Z)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    await clickSortOption(user, "Review Count (Fewest First)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    await clickSortOption(user, "Review Count (Most First)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillNameFilter(user, "Bram Stoker");

    await clickViewResults(user);

    const listBeforeClear = getGroupedAvatarList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getNameFilter()).toHaveValue("");

    await clickViewResults(user);

    const listAfterClear = getGroupedAvatarList().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillNameFilter(user, "Bram Stoker");

    // Apply the filters
    await clickViewResults(user);

    // Store the current view
    const listBeforeReset = getGroupedAvatarList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillNameFilter(user, "A different name...");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The view should still show the originally filtered results
    const listAfterReset = getGroupedAvatarList().innerHTML;
    expect(listAfterReset).toEqual(listBeforeReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getNameFilter()).toHaveValue("Bram Stoker");
  });
});
