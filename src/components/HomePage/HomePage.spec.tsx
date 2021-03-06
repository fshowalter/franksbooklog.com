// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from "@testing-library/react";
import HomePage, { Head } from "./HomePage";
import data from "./HomePage.fixtures";

describe("/", () => {
  it("renders", () => {
    const { asFragment } = render(
      <HomePage
        data={data}
        pageContext={{
          limit: 10,
          skip: 0,
          numberOfItems: 102,
          currentPage: 1,
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title for first page", () => {
    render(
      <Head
        pageContext={{
          limit: 10,
          skip: 0,
          numberOfItems: 102,
          currentPage: 1,
        }}
      />
    );

    expect(document.title).toStrictEqual(
      "Frank's Book Log: Literature is a relative term."
    );
  });

  it("sets page title for not-first page", () => {
    render(
      <Head
        pageContext={{
          limit: 10,
          skip: 10,
          numberOfItems: 102,
          currentPage: 2,
        }}
      />
    );

    expect(document.title).toStrictEqual("Page 2");
  });

  it("can render last page", () => {
    const { asFragment } = render(
      <HomePage
        data={data}
        pageContext={{
          limit: 10,
          skip: 100,
          numberOfItems: 102,
          currentPage: 11,
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
