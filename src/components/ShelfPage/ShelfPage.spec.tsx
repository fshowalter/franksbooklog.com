// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import ShelfPage from "./ShelfPage";
import data from "./ShelfPage.fixtures";

describe("/shelf", () => {
  it("renders", () => {
    const { asFragment } = render(<ShelfPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title", (done) => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual("Shelf");
      done();
    });
  });

  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

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

  it("can filter by not-found title", async () => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

    act(() => {
      jest.useFakeTimers(); // For the debouced input
      userEvent.type(screen.getByLabelText("Title"), "This work doesn't exist");
      jest.runOnlyPendingTimers(); // Flush the delay
      jest.useRealTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId("work-list")).toMatchSnapshot();
    });
  });

  it("can filter by author", () => {
    expect.hasAssertions();
    render(<ShelfPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Author"), "Stephen King");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can filter by author then show all", () => {
    render(<ShelfPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Author"), "Stephen King");
    userEvent.selectOptions(screen.getByLabelText("Author"), "All");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by title", () => {
    render(<ShelfPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Order By"), "Title");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by year published with oldest first", () => {
    render(<ShelfPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Oldest First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can sort by year published with newest first", () => {
    render(<ShelfPage data={data} />);

    userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Year Published (Newest First)"
    );

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can filter by year published", () => {
    render(<ShelfPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Year Published" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    userEvent.selectOptions(fromInput, "2000");
    userEvent.selectOptions(toInput, "2000");

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can hide reviewed titles", () => {
    render(<ShelfPage data={data} />);

    userEvent.click(screen.getByText("Hide Reviewed"));

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });

  it("can show hidden reviewed titles", () => {
    render(<ShelfPage data={data} />);

    userEvent.click(screen.getByText("Hide Reviewed"));
    userEvent.click(screen.getByText("Show Reviewed"));

    expect(screen.getByTestId("work-list")).toMatchSnapshot();
  });
});
