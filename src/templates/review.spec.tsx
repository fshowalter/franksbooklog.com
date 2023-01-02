import { render } from "@testing-library/react";
import ReviewPage, { Head } from "./review";
import { abandonedData, compilationData, data } from "./review.fixtures";

describe("/reviews/{slug}", () => {
  it("renders", () => {
    const { asFragment } = render(<ReviewPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders compilation", () => {
    const { asFragment } = render(<ReviewPage data={compilationData} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders abandoned", () => {
    const { asFragment } = render(<ReviewPage data={abandonedData} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head data={data} />);

    expect(document.title).toStrictEqual("Dracula by Bram Stoker");
  });
});
