import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthorTemplate, { Head } from "./author";
import { data } from "./author.fixtures";

describe("/shelf/authors/{slug}", () => {
  it("renders", () => {
    const { asFragment } = render(<AuthorTemplate data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head data={data} />);

    expect(document.title).toStrictEqual("Richard Laymon");
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<AuthorTemplate data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "The Cellar");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by title", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind", async () => {
    expect.hasAssertions();
    render(<AuthorTemplate data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1985");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can view more titles", async () => {
    expect.hasAssertions();

    render(<AuthorTemplate data={data} />);

    await userEvent.click(screen.getByText("Show More..."));

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });
});
