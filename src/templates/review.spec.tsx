import { render } from "@testing-library/react";
import ReviewTemplate, { Head } from "./review";
import { abandonedData, data, readingNoteData } from "./review.fixtures";

describe("/reviews/{slug}", () => {
  it("renders", () => {
    const { asFragment } = render(<ReviewTemplate data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("render abandoned without structured data", () => {
    const { asFragment } = render(<ReviewTemplate data={abandonedData} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("render reading notes", () => {
    const { asFragment } = render(<ReviewTemplate data={readingNoteData} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head data={data} />);

    expect(document.title).toStrictEqual("Behold the Void by Philip Fracassi");
  });
});
