import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthorsPage, { Head } from "./authors";
import { data } from "./authors.fixtures";

describe("/reviews/authors", () => {
  it("can filter by name", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Name"), "Bram Stoker");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by name z->a", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Name (Z → A)",
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by name a->z", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Name (A → Z)",
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by review count asc", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Count (Fewest First)",
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by review count desc", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Count (Most First)",
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by work count asc", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Work Count (Fewest First)",
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by work count desc", async () => {
    expect.hasAssertions();

    render(<AuthorsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Work Count (Most First)",
    );

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Authors");
  });
});
