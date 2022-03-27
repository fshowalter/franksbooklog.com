// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import ReviewsIndexPage from "./ReviewsIndexPage";
import data from "./ReviewsIndexPage.fixtures";

describe("/reviews", () => {
  it("renders", () => {
    const { asFragment } = render(<ReviewsIndexPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title", (done) => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual("Reviews");
      done();
    });
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    act(() => {
      jest.useFakeTimers(); // For the debouced input
      userEvent.type(screen.getByLabelText("Title"), "On Writing");
      jest.runOnlyPendingTimers(); // Flush the delay
      jest.useRealTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId("review-list")).toMatchSnapshot();
    });
  });

  it("can filter by kind", () => {
    expect.hasAssertions();
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by kind then show all", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");
    userEvent.selectOptions(screen.getByLabelText("Kind"), "All");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by read date with newest first", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Read Date (Newest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by read date with oldest first", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Read Date (Oldest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by title", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", () => {
    render(<ReviewsIndexPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by published year", () => {
    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Published Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "2000");
    userEvent.selectOptions(toInput, "2001");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by published year reversed", () => {
    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Published Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "2000");
    userEvent.selectOptions(toInput, "2001");
    userEvent.selectOptions(fromInput, "2001");
    userEvent.selectOptions(toInput, "2000");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by read year", () => {
    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Read Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "2022");
    userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by grade", () => {
    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "B-");
    userEvent.selectOptions(toInput, "A+");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });

  it("can filter by grade reversed", () => {
    render(<ReviewsIndexPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "B");
    userEvent.selectOptions(toInput, "B+");
    userEvent.selectOptions(fromInput, "A-");
    userEvent.selectOptions(toInput, "B-");

    expect(screen.getByTestId("review-list")).toMatchSnapshot();
  });
});
