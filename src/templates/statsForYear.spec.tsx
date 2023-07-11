import { render } from "@testing-library/react";
import StatsForYearTemplate, { Head } from "./statsForYear";
import { data } from "./statsForYear.fixtures";

describe("/stats/{year}", () => {
  it("sets page title", () => {
    render(<Head pageContext={{ year: 2022 }} />);

    expect(document.title).toStrictEqual("2022 Stats");
  });

  it("renders for current year", () => {
    const thisYear = 2022;

    const { asFragment } = render(
      <StatsForYearTemplate data={data} pageContext={{ year: thisYear }} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
