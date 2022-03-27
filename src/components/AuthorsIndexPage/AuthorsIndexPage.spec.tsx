// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AuthorsIndexPage from "./AuthorsIndexPage";
import data from "./AuthorsIndexPage.fixtures";

describe("/shelf/authors/", () => {
  it("can filter by name", async () => {
    expect.hasAssertions();
    render(<AuthorsIndexPage data={data} />);

    act(() => {
      jest.useFakeTimers(); // For the debouced input
      userEvent.type(screen.getByLabelText("Name"), "Stephen King");
      jest.runOnlyPendingTimers(); // Flush the delay
      jest.useRealTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId("author-list")).toMatchSnapshot();
    });
  });

  it("can sort by name", () => {
    render(<AuthorsIndexPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Order By"), "Name");

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by review count", () => {
    render(<AuthorsIndexPage data={data} />);

    userEvent.selectOptions(screen.getByLabelText("Order By"), "Review Count");

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title", (done) => {
    expect.hasAssertions();
    render(<AuthorsIndexPage data={data} />);

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual("Shelf Authors");
      done();
    });
  });
});
