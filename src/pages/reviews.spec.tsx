import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ReviewsPage, { Head } from "./reviews";
import { data } from "./reviews.fixtures";

describe("/reviews", () => {
  it("renders", () => {
    const { asFragment } = render(<ReviewsPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Reviews");
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<ReviewsPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Dracula");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind", async () => {
    expect.hasAssertions();
    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind then show all", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await act(async () => {
      await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");
      await userEvent.selectOptions(screen.getByLabelText("Kind"), "All");
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by author z->a", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Author (Z → A)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by date reviewed with newest first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by date reviewed with oldest first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by title a->z", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by title z->a", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Work Year (Oldest First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Work Year (Newest First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("sorts abandoned readings first", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    const fieldset = screen.getByRole("group", {
      name: "Work Year",
    });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published reversed", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    const fieldset = screen.getByRole("group", {
      name: "Work Year",
    });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");
    await userEvent.selectOptions(fromInput, "2001");
    await userEvent.selectOptions(toInput, "1977");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year reviewed", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year reviewed reversed", async () => {
    expect.hasAssertions();

    render(<ReviewsPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });
});
