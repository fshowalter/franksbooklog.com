import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/testUtils";
import { getUserWithFakeTimers } from "~/components/testUtils";
import { fillTextFilter } from "~/components/TextFilter.testHelper";

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

    await fillTextFilter(user, "Name", "Bram Stoker");

    expect(screen.getByTestId("grouped-avatar-list")).toMatchSnapshot();
  });

  it("can sort by name z->a", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Name (Z → A)",
    );

    expect(screen.getByTestId("grouped-avatar-list")).toMatchSnapshot();
  });

  it("can sort by name a->z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Name (A → Z)",
    );

    expect(screen.getByTestId("grouped-avatar-list")).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Count (Fewest First)",
    );

    expect(screen.getByTestId("grouped-avatar-list")).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Count (Most First)",
    );

    expect(screen.getByTestId("grouped-avatar-list")).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTextFilter(user, "Name", "Bram Stoker");

    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(screen.getByLabelText("Name")).toHaveValue("");

    await clickViewResults(user);

    expect(screen.getByTestId("grouped-avatar-list")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Authors {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTextFilter(user, "Name", "Bram Stoker");

    // Apply the filters
    await clickViewResults(user);

    // Store the current view
    const listBeforeReset = screen.getByTestId("grouped-avatar-list");

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTextFilter(user, "Name", "A different name...");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The view should still show the originally filtered results
    const listAfterReset = screen.getByTestId("grouped-avatar-list");
    expect(listAfterReset).toBe(listBeforeReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Name")).toHaveValue("Bram Stoker");
  });
});
