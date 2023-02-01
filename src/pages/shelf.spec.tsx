import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShelfPage, { Head } from "./shelf";
import { data } from "./shelf.fixtures";

describe("/shelf", () => {
  it("renders", () => {
    const { asFragment } = render(<ShelfPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("The Shelf");
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Lawyer Man");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by not-found title", async () => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

    await act(async () => {
      await userEvent.type(
        screen.getByLabelText("Title"),
        "This movie doesn't exist"
      );
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by author", async () => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Author"),
      "Bram Stoker"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by author then show all", async () => {
    expect.hasAssertions();

    render(<ShelfPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Author"),
      "Bram Stoker"
    );
    await userEvent.selectOptions(screen.getByLabelText("Author"), "All");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by title", async () => {
    expect.hasAssertions();

    render(<ShelfPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async () => {
    expect.hasAssertions();

    render(<ShelfPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async () => {
    expect.hasAssertions();

    render(<ShelfPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published", async () => {
    expect.hasAssertions();

    render(<ShelfPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can show more titles", async () => {
    expect.hasAssertions();

    render(<ShelfPage data={data} />);

    await userEvent.click(screen.getByText("Show More..."));

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });
});
