import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/FilterAndSort/FilterAndSortContainer.testHelper";
import {
  clickKindFilterOption,
  fillTitleFilter,
  fillWorkYearFilter,
  getTitleFilter,
} from "~/components/FilterAndSort/WorkFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import { getProps } from "./getProps";
import { Readings } from "./Readings";
import {
  clickEditionFilterOption,
  clickNextMonthButton,
  clickPreviousMonthButton,
  fillReadingYearFilter,
  getCalendar,
  getEditionFilter,
  queryNextMonthButton,
  queryPreviousMonthButton,
} from "./Readings.testHelper";

export const props = await getProps();

describe("Readings", () => {
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

  it("renders", ({ expect }) => {
    const { asFragment } = render(<Readings {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTitleFilter(user, "Dracula");

    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by edition", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await clickEditionFilterOption(user, "Paperback");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by edition then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await clickEditionFilterOption(user, "Paperback");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickEditionFilterOption(user, "All");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by kind", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await clickKindFilterOption(user, "Novel");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by kind then show all", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await clickKindFilterOption(user, "Novel");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickKindFilterOption(user, "All");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can sort by reading date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickSortOption(user, "Reading Date (Newest First)");

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can sort by reading date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickSortOption(user, "Reading Date (Oldest First)");

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by work year", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await fillWorkYearFilter(user, "1978", "1980");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by work year reversed", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await fillWorkYearFilter(user, "1953", "1975");

    // Apply the filter
    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillWorkYearFilter(user, "1979", "1975");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by reading year", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await fillReadingYearFilter(user, "2012", "2012");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by reading year reversed", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    await clickToggleFilters(user);

    await fillReadingYearFilter(user, "2012", "2014");

    // Apply the filter
    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillReadingYearFilter(user, "2015", "2012");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can navigate to previous month", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    // Sort by oldest first to ensure we have a next month button
    await clickSortOption(user, "Reading Date (Newest First)");

    await clickPreviousMonthButton(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can navigate to next month", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    // Sort by oldest first to ensure we have a next month button
    await clickSortOption(user, "Reading Date (Oldest First)");

    await clickNextMonthButton(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("shows correct month navigation buttons", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    // Default sort is newest first, should show previous month button
    const prevMonthButton = queryPreviousMonthButton();
    const nextMonthButton = queryNextMonthButton();

    // At newest month, should only have previous month button
    expect(prevMonthButton).toBeInTheDocument();
    expect(nextMonthButton).not.toBeInTheDocument();

    // Sort by oldest first
    await clickSortOption(user, "Reading Date (Oldest First)");

    // At oldest month, should only have next month button
    const prevMonthButtonAfterSort = queryPreviousMonthButton();
    const nextMonthButtonAfterSort = queryNextMonthButton();

    expect(prevMonthButtonAfterSort).not.toBeInTheDocument();
    expect(nextMonthButtonAfterSort).toBeInTheDocument();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "The Shining");

    await clickEditionFilterOption(user, "Paperback");

    await clickViewResults(user);

    const listBeforeClear = getCalendar().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getTitleFilter()).toHaveValue("");
    expect(getEditionFilter()).toHaveValue("All");

    await clickViewResults(user);

    const listAfterClear = getCalendar().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Readings {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTitleFilter(user, "Dracula");

    // Apply the filters
    await clickViewResults(user);

    // Store the current view
    const listBeforeReset = getCalendar().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "Different Movie");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The view should still show the originally filtered results
    const listAfterReset = getCalendar().innerHTML;

    expect(listBeforeReset).toEqual(listAfterReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("Dracula");
  });
});
