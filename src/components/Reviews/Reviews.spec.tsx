import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { getProps } from "./getProps";
import { Reviews } from "./Reviews";

const props = await getProps();

describe("Reviews", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Reviews {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Reviews {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Dracula");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by kind", async ({ expect }) => {
    expect.hasAssertions();
    render(<Reviews {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by kind then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");
    await userEvent.selectOptions(screen.getByLabelText("Kind"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by author z->a", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Author (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by date reviewed with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by date reviewed with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title a->z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title z->a", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Work Year (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Work Year (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("sorts abandoned readings first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by year published", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    const fieldset = screen.getByRole("group", {
      name: "Work Year",
    });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by year published reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    const fieldset = screen.getByRole("group", {
      name: "Work Year",
    });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");
    await userEvent.selectOptions(fromInput, "2015");
    await userEvent.selectOptions(toInput, "1977");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by year reviewed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by year reviewed reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Reviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more items when button is clicked", async ({ expect }) => {
    expect.hasAssertions();

    // Create many test items to trigger pagination (need more than 100)
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      ...props.values[0], // Use first item as template
      slug: `test-review-${i}`,
      sortTitle: `Test Review ${i}`,
      title: `Test Review ${i}`,
    }));

    const testProps = {
      ...props,
      values: manyValues,
    };

    render(<Reviews {...testProps} />);

    // Should show Show More button since we have 150 items > 100 default
    const showMoreButton = screen.getByText("Show More");
    expect(showMoreButton).toBeInTheDocument();

    await userEvent.click(showMoreButton);

    // Snapshot the result to verify more items are rendered
    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
