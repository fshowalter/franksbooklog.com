// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from "@testing-library/react";
import ReviewPage, { Head } from "./ReviewPage";
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

  it("sets page title", () => {
    render(<Head data={data} />);

    expect(document.title).toStrictEqual("On Writing by Stephen King");
  });
});
