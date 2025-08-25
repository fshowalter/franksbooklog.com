import { render, screen, within } from "@testing-library/react";
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
    render(<Author {...props} />);

    const user = getUserWithFakeTimers();

    await fillTextFilter(user, "Title", "The Cellar");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by title a->z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by title z->a", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by work year with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Work Year (Oldest First)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by work year with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Work Year (Newest First)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by date reviewed with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can sort by date reviewed with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can filter by grade", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B-");
    await userEvent.selectOptions(toInput, "A+");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can filter by grade reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B");
    await userEvent.selectOptions(toInput, "B+");
    await userEvent.selectOptions(fromInput, "A-");
    await userEvent.selectOptions(toInput, "B-");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can filter by year reviewed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can filter by year reviewed reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can filter by kind", async ({ expect }) => {
    expect.hasAssertions();
    render(<Author {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can filter by year published", async ({ expect }) => {
    expect.hasAssertions();

    render(<Author {...props} />);

    const fieldset = screen.getByRole("group", { name: "Work Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1985");

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
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

    render(<Author {...testProps} />);

    // Should show Show More button since we have 150 items > 100 default
    const showMoreButton = screen.getByText("Show More");
    expect(showMoreButton).toBeInTheDocument();

    await userEvent.click(showMoreButton);

    // Snapshot the result to verify more items are rendered
    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTextFilter(user, "Title", "The Cellar");

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Kind")).toHaveValue("All");

    await clickViewResults(user);

    expect(screen.getByTestId("grouped-cover-list")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Author {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTextFilter(user, "Title", "The Cellar");

    // Apply the filters
    await clickViewResults(user);

    // Store the current view
    const listBeforeReset = screen.getByTestId("grouped-cover-list");

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTextFilter(user, "Title", "A different title...");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The view should still show the originally filtered results
    const listAfterReset = screen.getByTestId("grouped-cover-list");
    expect(listAfterReset).toBe(listBeforeReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Title")).toHaveValue("The Cellar");
  });
});
