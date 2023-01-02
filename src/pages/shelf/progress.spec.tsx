import { render } from "@testing-library/react";
import ProgressPage, { Head } from "./progress";
import { data } from "./progress.fixtures";

describe("/shelf/progress/", () => {
  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Shelf Progress");
  });

  it("renders shelf progress", () => {
    const { asFragment } = render(<ProgressPage data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
