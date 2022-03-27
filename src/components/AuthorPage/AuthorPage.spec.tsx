// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AuthorPage from "./AuthorPage";
import data from "./AuthorPage.fixtures";

describe("/shelf/authors/{slug}", () => {
  it("renders", () => {
    const { asFragment } = render(<AuthorPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title", (done) => {
    expect.hasAssertions();
    render(<AuthorPage data={data} />);

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual("Stephen King");
      done();
    });
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<AuthorPage data={data} />);

    act(() => {
      jest.useFakeTimers(); // For the debouced input
      userEvent.type(screen.getByLabelText("Title"), "On Writing");
      jest.runOnlyPendingTimers(); // Flush the delay
      jest.useRealTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId("work-list")).toMatchSnapshot();
    });
  });

  it("can sort by title", () => {
    render(<AuthorPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", () => {
    render(<AuthorPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", () => {
    render(<AuthorPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by grade with Best first", () => {
    render(<AuthorPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Best First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", () => {
    render(<AuthorPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Grade (Worst First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can filter by year published", () => {
    render(<AuthorPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "2000");
    userEvent.selectOptions(toInput, "2000");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });
});
