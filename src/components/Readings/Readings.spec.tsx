import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { DRAWER_CLOSE_ANIMATION_MS } from "~/components/ListWithFilters/ListWithFilters";
import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextFilter";

import { getProps } from "./getProps";
import { Readings } from "./Readings";

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
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Readings {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "Rio Bravo");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filter
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by kind", async ({ expect }) => {
    expect.hasAssertions();
    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by kind then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "All");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by edition", async ({ expect }) => {
    expect.hasAssertions();
    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "Audible");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by edition then show all", async ({ expect }) => {
    expect.hasAssertions();
    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "Audible");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "All");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can sort by reading date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Reading Date (Newest First)",
    );

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can sort by reading date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Reading Date (Oldest First)",
    );

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by work year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Work Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by work year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Work Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");
    await userEvent.selectOptions(fromInput, "2015");
    await userEvent.selectOptions(toInput, "1977");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by reading year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Reading Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    // Use a narrower range that will actually filter out some data
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2023");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by reading year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Reading Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2023");
    await userEvent.selectOptions(fromInput, "2023");
    await userEvent.selectOptions(toInput, "2022");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can navigate to previous month", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Sort by oldest first to ensure we have a next month button
    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Reading Date (Oldest First)",
    );

    // Find and click the next month button first to ensure we can go back
    const nextMonthButton = await screen.findByRole("button", {
      name: /Navigate to next month:/,
    });
    await userEvent.click(nextMonthButton);

    // Now find and click the previous month button
    const prevMonthButton = await screen.findByRole("button", {
      name: /Navigate to previous month:/,
    });
    await userEvent.click(prevMonthButton);

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can navigate to next month", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Sort by oldest first to ensure we start at the beginning
    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Reading Date (Oldest First)",
    );

    // Find and click the next month button
    const nextMonthButton = await screen.findByRole("button", {
      name: /Navigate to next month:/,
    });
    await userEvent.click(nextMonthButton);

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("shows correct month navigation buttons", async ({ expect }) => {
    expect.hasAssertions();

    render(<Readings {...props} />);

    // Default sort is newest first, should show previous month button
    const prevMonthButton = screen.queryByRole("button", {
      name: /Navigate to previous month:/,
    });
    const nextMonthButton = screen.queryByRole("button", {
      name: /Navigate to next month:/,
    });

    // At newest month, should only have previous month button
    expect(prevMonthButton).toBeInTheDocument();
    expect(nextMonthButton).not.toBeInTheDocument();

    // Sort by oldest first
    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Reading Date (Oldest First)",
    );

    // At oldest month, should only have next month button
    const prevMonthButtonAfterSort = screen.queryByRole("button", {
      name: /Navigate to previous month:/,
    });
    const nextMonthButtonAfterSort = screen.queryByRole("button", {
      name: /Navigate to next month:/,
    });

    expect(prevMonthButtonAfterSort).not.toBeInTheDocument();
    expect(nextMonthButtonAfterSort).toBeInTheDocument();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Readings {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply multiple filters
    await user.type(screen.getByLabelText("Title"), "Dracula");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "Audible");

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Clear all filters
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    // Check that filters are cleared
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Edition")).toHaveValue("All");

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Readings {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply initial filter
    await user.type(screen.getByLabelText("Title"), "Dracula");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filters
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Store the current view
    const calendarFiltered = screen.getByTestId("calendar");
    const monthsFiltered = within(calendarFiltered).queryAllByRole("heading", {
      level: 2,
    }).length;

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Start typing a new filter but don't apply
    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Different Book");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Close the drawer with the X button (should reset pending changes)
    await user.click(screen.getByRole("button", { name: "Close filters" }));

    // Wait for drawer close animation
    act(() => {
      vi.advanceTimersByTime(DRAWER_CLOSE_ANIMATION_MS);
    });

    // The view should still show the originally filtered results
    const calendarAfterReset = screen.getByTestId("calendar");
    const monthsAfterReset = within(calendarAfterReset).queryAllByRole(
      "heading",
      { level: 2 },
    ).length;
    expect(monthsAfterReset).toBe(monthsFiltered);

    // Open filter drawer again to verify filters were reset to last applied state
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Title")).toHaveValue("Dracula");
  });
});
