// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewsIndexPage, { Head } from "./ReviewsIndexPage";
import data from "./ReviewsIndexPage.fixtures";

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
      await userEvent.type(screen.getByLabelText("Title"), "On Writing");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by kind", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by kind then show all", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");
    await userEvent.selectOptions(screen.getByLabelText("Kind"), "All");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by read date with newest first", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Read Date (Newest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by read date with oldest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Read Date (Oldest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by title", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by published year", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Published Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2000");
    await userEvent.selectOptions(toInput, "2001");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by published year reversed", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Published Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2000");
    await userEvent.selectOptions(toInput, "2001");
    await userEvent.selectOptions(fromInput, "2001");
    await userEvent.selectOptions(toInput, "2000");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by read year", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Read Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by grade", async () => {
    expect.hasAssertions();

    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B-");
    await userEvent.selectOptions(toInput, "A+");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
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

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });
});
