import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickShowMore,
  getGroupedCoverList,
} from "~/components/CoverList.testHelper";
import { clickSortOption } from "~/components/ListWithFilters/ListWithFilters.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/testUtils";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";
import {
  clickKindFilterOption,
  fillGradeFilter,
  fillReviewYearFilter,
  fillTitleFilter,
  fillWorkYearFilter,
  getKindFilter,
  getTitleFilter,
} from "~/components/WorkFilters.testHelper";

import { Author } from "./Author";
import { getProps } from "./getProps";

const props = await getProps("richard-laymon");

describe("Author", () => {
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

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await fillTitleFilter(user, "The Cellar");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by title a->z", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Title (A → Z)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by title z->a", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Title (Z → A)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by work year with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Work Year (Oldest First)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by work year with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Work Year (Newest First)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Grade (Best First)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Grade (Worst First)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by date reviewed with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Review Date (Newest First)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can sort by date reviewed with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickSortOption(user, "Review Date (Oldest First)");

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can filter by grade", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await fillGradeFilter(user, "B-", "A+");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can filter by grade reversed", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await fillGradeFilter(user, "B-", "A+");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillGradeFilter(user, "A-", "B-");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can filter by year reviewed", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await fillReviewYearFilter(user, "2022", "2022");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can filter by year reviewed reversed", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await fillReviewYearFilter(user, "2022", "2022");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillReviewYearFilter(user, "2022", "2022");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can filter by kind", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await clickKindFilterOption(user, "Novel");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can filter by work year", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    await clickToggleFilters(user);

    await fillWorkYearFilter(user, "1980", "1985");

    await clickViewResults(user);

    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can show more items when button is clicked", async ({ expect }) => {
    expect.hasAssertions();

    // Create many test items to trigger pagination (need more than 100)
    const manyWorks = Array.from({ length: 150 }, (_, i) => ({
      ...props.values[0], // Use first work as template
      slug: `test-work-${i}`,
      sortTitle: `Test Work ${i}`,
      title: `Test Work ${i}`,
    }));

    const testProps = {
      ...props,
      values: manyWorks,
    };

    const user = getUserWithFakeTimers();

    render(<Author {...testProps} />);

    // Should show Show More button since we have 150 items > 100 default
    await clickShowMore(user);

    // Snapshot the result to verify more items are rendered
    expect(getGroupedCoverList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "The Cellar");

    await clickKindFilterOption(user, "Novel");

    await clickViewResults(user);

    const listBeforeClear = getGroupedCoverList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getTitleFilter()).toHaveValue("");
    expect(getKindFilter()).toHaveValue("All");

    await clickViewResults(user);

    const listAfterClear = getGroupedCoverList().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTitleFilter(user, "The Cellar");

    // Apply the filters
    await clickViewResults(user);

    // Store the current view
    const listBeforeReset = getGroupedCoverList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "A different title...");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The view should still show the originally filtered results
    const listAfterReset = getGroupedCoverList().innerHTML;
    expect(listAfterReset).toBe(listBeforeReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("The Cellar");
  });
});
