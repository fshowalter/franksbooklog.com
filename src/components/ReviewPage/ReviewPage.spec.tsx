// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from "@testing-library/react";
import React from "react";
import ReviewPage from "./ReviewPage";
import data, { abandonedBook, audioBook } from "./ReviewPage.fixtures";

describe("/reviews/{slug}", () => {
  it("renders", () => {
    const { asFragment } = render(<ReviewPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders for audio book", () => {
    const { asFragment } = render(<ReviewPage data={audioBook} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders for abandoned book", () => {
    const { asFragment } = render(<ReviewPage data={abandonedBook} />);

    expect(asFragment()).toMatchSnapshot();
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title", (done) => {
    expect.hasAssertions();
    render(<ReviewPage data={data} />);

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual("On Writing by Stephen King");
      done();
    });
  });
});
