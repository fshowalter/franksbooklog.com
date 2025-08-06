import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { Authors } from "./Authors";
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

  it("can show more items when button is clicked", async ({ expect }) => {
    expect.hasAssertions();

    // Create many test items to trigger pagination (need more than 100)
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      ...props.values[0], // Use first item as template
      name: `Test Author ${i}`,
      slug: `test-author-${i}`,
      sortName: `Author ${i}, Test`,
    }));

    const testProps = {
      ...props,
      values: manyValues,
    };

    render(<Authors {...testProps} />);

    // Should show Show More button since we have 150 items > 100 default
    const showMoreButton = screen.getByText("Show More");
    expect(showMoreButton).toBeInTheDocument();

    await userEvent.click(showMoreButton);

    // Snapshot the result to verify more items are rendered
    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
