import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewsIndexPage, { Head } from "./reviews";
import { data } from "./reviews.fixtures";

describe("/reviews", () => {
  it("renders", () => {
    const { asFragment } = render(<ReviewsIndexPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Reviews");
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Dracula");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind then show all", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");
    await userEvent.selectOptions(screen.getByLabelText("Kind"), "All");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by edition", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "Audible");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by edition then show all", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "Audible");
    await userEvent.selectOptions(screen.getByLabelText("Edition"), "All");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by date read with newest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Date Read (Newest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by date read with oldest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Date Read (Oldest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by title", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("sorts unrated readings last", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published reversed", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");
    await userEvent.selectOptions(fromInput, "2001");
    await userEvent.selectOptions(toInput, "1977");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year read", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Read" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year read reversed", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Read" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by grade", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B-");
    await userEvent.selectOptions(toInput, "A+");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by grade reversed", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B");
    await userEvent.selectOptions(toInput, "B+");
    await userEvent.selectOptions(fromInput, "A-");
    await userEvent.selectOptions(toInput, "B-");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can exclude abandoned works", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Date Read (Oldest First)"
    );

    await userEvent.click(screen.getByLabelText("Include abandoned works"));

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can show more titles", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.click(screen.getByText("Show More..."));

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });
});
