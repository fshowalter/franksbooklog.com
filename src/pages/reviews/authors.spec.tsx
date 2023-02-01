import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShelfAuthorsPage, { Head } from "./authors";
import { data } from "./authors.fixtures";

describe("/reviews/authors", () => {
  it("can filter by name", async () => {
    expect.hasAssertions();

    render(<ShelfAuthorsPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Name"), "Bram Stoker");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by name desc", async () => {
    expect.hasAssertions();

    render(<ShelfAuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Name (Z ← A)"
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Authors");
  });
});
