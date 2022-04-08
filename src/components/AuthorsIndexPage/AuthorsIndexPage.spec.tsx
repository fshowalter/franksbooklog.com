// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AuthorsIndexPage from "./AuthorsIndexPage";
import data from "./AuthorsIndexPage.fixtures";

describe("/shelf/authors/", () => {
  it("can filter by name", async () => {
    expect.hasAssertions();
    render(<AuthorsIndexPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Name"), "Stephen King");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by name", async () => {
    expect.hasAssertions();
    render(<AuthorsIndexPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Order By"), "Name");

    expect(screen.getByTestId("author-list")).toMatchSnapshot();
  });

  it("can sort by review count", async () => {
    expect.hasAssertions();
    render(<AuthorsIndexPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Review Count"
    );

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
