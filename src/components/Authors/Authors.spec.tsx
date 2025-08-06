import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { Authors } from "./Authors";
import { Actions, reducer } from "./Authors.reducer";
import { getProps } from "./getProps";

const props = await getProps();

describe("Authors", () => {
  it("can filter by name", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Name"), "Bram Stoker");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by name z->a", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Name (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by name a->z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Name (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Count (Fewest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Authors {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Count (Most First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("handles SHOW_MORE action", ({ expect }) => {
    expect.hasAssertions();
    
    // Test the reducer directly to cover the SHOW_MORE action
    const initialState = reducer(props.values, { type: Actions.SORT, value: "name-asc" });
    const stateWithMore = reducer(initialState, { type: Actions.SHOW_MORE });
    
    expect(stateWithMore.showCount).toBeGreaterThan(initialState.showCount);
    expect(stateWithMore.groupedValues).toBeDefined();
  });
});
