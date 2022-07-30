// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthorsIndexPage, { Head } from "./AuthorsIndexPage";
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

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Authors");
  });
});
