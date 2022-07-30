// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthorPage, { Head } from "./AuthorPage";
import data from "./AuthorPage.fixtures";

describe("/shelf/authors/{slug}", () => {
  it("renders", () => {
    const { asFragment } = render(<AuthorPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head data={data} />);

    expect(document.title).toStrictEqual("Stephen King");
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<AuthorPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "On Writing");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by title", async () => {
    expect.hasAssertions();
    render(<AuthorPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async () => {
    expect.hasAssertions();

    render(<AuthorPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async () => {
    expect.hasAssertions();

    render(<AuthorPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by grade with Best first", async () => {
    expect.hasAssertions();

    render(<AuthorPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async () => {
    expect.hasAssertions();

    render(<AuthorPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can filter by year published", async () => {
    expect.hasAssertions();

    render(<AuthorPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2000");
    await userEvent.selectOptions(toInput, "2000");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });
});
